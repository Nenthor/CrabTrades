import numpy as np
import pandas as pd
import datetime
import json
import requests
from io import BytesIO, SEEK_SET, SEEK_END
from pathlib import Path
from dotenv import dotenv_values

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
from sklearn.preprocessing import MinMaxScaler

from alpaca.trading.client import TradingClient
from alpaca.trading.requests import MarketOrderRequest
from alpaca.trading.enums import OrderSide, TimeInForce

# Config
BASE_URL = "https://crabtrades.com" 
SYMBOL = "AAPL"
TIME_FRAME = "6Hour"
USE_SAVED_MODEL = True
SHOULD_TRADE = True
DOWNLOAD_DATASET = True
RISK_PER_TRADE = 0.05

env_config = dotenv_values(".env")
ADMIN_KEY = env_config["ADMIN_KEY"]
ALPACA_API_KEY = env_config["ALPACA_API_KEY"]
ALPACA_SECRET_KEY = env_config["ALPACA_SECRET_KEY"]

def download_dataset():
    current_utc_time = datetime.datetime.utcnow()
    end_date = current_utc_time.strftime("%Y-%m-%d") + "T00:00:00.000Z"
    start_date = "2016-01-01T00:00:00.000Z"

    if DOWNLOAD_DATASET or not Path('dataset.csv').is_file():
        try:
            response = requests.post(BASE_URL + "/api/fetchHistoricalStock", headers={
                "Enddate": end_date,
                "Startdate": start_date,
                "Symbol": SYMBOL,
                "Timeframe": TIME_FRAME,
                "admin-token": ADMIN_KEY
            })

        except requests.exceptions.RequestException as e:
            raise SystemExit(f"[/api/fetchHistoricalStock] Request error: {e}")

        if(response.status_code != 200):
            print(response.text)
            raise SystemExit(f"[/api/fetchHistoricalStock] Repsonse status code: {response.status_code}")

        parsed_json = response.json()

        df = pd.DataFrame(parsed_json)
        df.to_csv('dataset.csv', index=False)
        return df

    return pd.DataFrame()

def make_prediction(df):
    df.rename(columns={
        "ClosePrice": "Close", 
        "HighPrice": "High", 
        "LowPrice": "Low", 
        "OpenPrice": "Open", 
        "Timestamp": "Date",
        "TradeCount": "Trades"
    }, inplace=True)
    df.index = pd.to_datetime(df["Date"])
    df = df[["Open", "High", "Low", "Volume", "VWAP", "Trades", "Close"]]

    # https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#returning-a-view-versus-a-copy
    pd.options.mode.copy_on_write = True

    # Add running averages of 200 and 50 days
    df.loc[:, '200MA'] = df['Close'].rolling(window=200).mean()
    df.loc[:, '50MA'] = df['Close'].rolling(window=50).mean()
    df = df.dropna()
    df[["Open", "High", "Low", "Volume", "VWAP", "Trades", "200MA", "50MA", "Close"]]
    print(df.head(5))

    # Feature scaling
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df[["Open", "High", "Low", "Volume", "VWAP", "Trades", "200MA", "50MA", "Close"]])
    scaled_data[10] # sequence_length. Take a look at last number, and y's first number

    # Create sequences of data for input and target
    def create_sequences(data, sequence_length):
        X, y = [], []
        for i in range(len(data) - sequence_length):
            X.append(data[i:(i+sequence_length)])
            y.append(data[i+sequence_length, 8])  # 6 corresponds to the 'Close' column
        return np.array(X), np.array(y)

    sequence_length = 10  # You can adjust this window size based on your needs
    X, y = create_sequences(scaled_data, sequence_length)

    # Split the data into training and testing sets
    SPLIT = 0.8
    split = int(SPLIT * len(X))
    X_train, X_test, y_train, y_test = X[:split], X[split:], y[:split], y[split:]

    # Build the LSTM model
    model = Sequential()
    model.add(LSTM(units=50, activation='relu', input_shape=(X_train.shape[1], X_train.shape[2]), return_sequences=True))
    model.add(LSTM(units=50, activation='relu'))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.summary()

    if USE_SAVED_MODEL and Path("model.keras").exists() and Path("model.keras").is_file():
        # Load the model
        model = tf.keras.models.load_model('model.keras')
    else:
        # Train the model
        fit_history = model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1)
        model.save('model.keras')

    # Evaluate the model on the test 
    if y_test.size != 0:
        loss = model.evaluate(X_test, y_test)
        print(f'Mean Squared Error on Test Set: {loss}')

        # Predict future closes
        predicted_closes = model.predict(X_test)

    # Use the last sequence_length days' data for tomorrow prediction
    last_window = scaled_data[-sequence_length:]

    # Reshape the data for prediction
    last_window = last_window.reshape(1, sequence_length, last_window.shape[1])

    # Make a prediction for the next day
    predicted_close = model.predict(last_window)

    # Inverse transform the prediction to get the actual closing price
    predicted_close = scaler.inverse_transform(np.concatenate((last_window[:, -1, :-1], predicted_close.reshape(-1, 1)), axis=1))[:, -1]

    # If price tommorow is bigger than today, we should buy
    should_buy = predicted_close > df['Close'][df.index[-1]]

    print(f'Predicted Close for the Next Day: {predicted_close[0]}')
    print(f'Today: {df["Close"][df.index[-1]]}')
    print(f'Should buy: {should_buy}')

    return should_buy, df

def trade_alpaca(should_buy, df):
    # Calculate the True Range (TR)
    df['High-Low'] = df['High'] - df['Low']
    df['High-Close-Prev'] = abs(df['High'] - df['Close'].shift(1))
    df['Low-Close-Prev'] = abs(df['Low'] - df['Close'].shift(1))
    df['True Range'] = df[['High-Low', 'High-Close-Prev', 'Low-Close-Prev']].max(axis=1)

    # Calculate the ATR for the last day in the dataset without using a rolling average
    ATR = df['True Range'].tail(14).mean()

    # Drop intermediate columns used for calculations
    data = df.drop(['High-Low', 'High-Close-Prev', 'Low-Close-Prev', 'True Range'], axis=1)

    trading_client = TradingClient(ALPACA_API_KEY, ALPACA_SECRET_KEY, paper=True)

    account = trading_client.get_account()
    if account.trading_blocked:
        raise SystemExit("[Alpaca] Account is currently restricted from trading.")

    asset = trading_client.get_asset(SYMBOL)
    if not asset.tradable:
        raise SystemExit("[Alpaca] The requested asset is not tradable.")

    # Get current price of the stock
    all_positions = trading_client.get_all_positions()
    traded_position = None

    for position in all_positions:
        if position.symbol == SYMBOL:
            traded_position = position
            break

    last_price = df['Close'][df.index[-1]]
    current_quantity = 0
    if traded_position != None:
        last_price = float(traded_position.current_price)
        current_quantity = float(traded_position.qty)

    decision = "BUY" if should_buy else "SELL"

    # Volatility-based Position Sizing
    # Risk per Trade is the percentage of capital you are willing to risk on the trade.
    # ATR is the Average True Range, a measure of volatility.
    trade_quantity = RISK_PER_TRADE * float(account.portfolio_value) / ATR / last_price

    # Trade as much, as I can
    if decision == "SELL":
        trade_quantity = min(current_quantity, trade_quantity) 

    if SHOULD_TRADE:
        if (should_buy and float(account.buying_power) > last_price) or (not should_buy and current_quantity > 0):
            # preparing market order
            market_order_data = MarketOrderRequest(
                symbol=SYMBOL,
                qty=trade_quantity,
                side= OrderSide.BUY if should_buy else OrderSide.SELL,
                time_in_force=TimeInForce.DAY
            )

            # Market order
            market_order = trading_client.submit_order(
                order_data=market_order_data
            )
        else:
            print("Not enough buying power/quantity to trade.")
            decision = "HOLD"
    else:
        raise SystemExit("[Config] SHOULD_TRADE = False")


    portfolio_value = account.portfolio_value
    date = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    return account, trade_quantity, decision, last_price

def log_to_firestore(alpaca_account, trade_quantity, decision, last_price):
    portfolio_value = alpaca_account.portfolio_value
    date = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")

    print(f"Date: {date}")
    print(f"Budget: {portfolio_value}")
    print(f"Quantity: {trade_quantity}")
    print(f"Decision: {decision}")
    print(f"Last Price: {last_price}")

    try:
        response = requests.post(BASE_URL + "/api/firestore", headers = {
            "symbol": SYMBOL,
            "date": date,
            "portfolioValue": portfolio_value,
            "quantity": str(trade_quantity),
            "decision": decision,
            "lastPrice": last_price,
            "admin-token": ADMIN_KEY
        })
    except requests.exceptions.RequestException as e:
        raise SystemExit(f"[/api/firestore] Request error: {e}")

    if(response.status_code != 200):
        raise SystemExit(f"[/api/firestore] Repsonse status code: {response.status_code}")

# Main
def main():
    df = download_dataset()
    should_buy, df = make_prediction(df)
    alpaca_account, trade_quantity, decision, last_price = trade_alpaca(should_buy, df)
    log_to_firestore(alpaca_account, trade_quantity, decision, last_price)

main()
