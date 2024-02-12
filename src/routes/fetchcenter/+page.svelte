<script lang="ts">
  import { CSV_START, toStockFileString } from '$lib/AlpacaPublic';
  import Navbar from '$lib/components/Navbar.svelte';
  import SimpleChart from '$lib/components/SimpleChart.svelte';
  import type { TimeFrame } from '$lib/server/Alpaca';
  import type { ChartProps } from '$lib/types';
  import type { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
  import { onDestroy } from 'svelte';

  /*
  const data = getHistoricalStockData(['GOOGL'], new Date('2000-01-01'), new Date('2024-02-10'), '1Min');
  const text = await toStockString(data);
  uploadFile('historical-stock-data', 'GOOGL.txt', text);
  console.log('File uploaded');
  */

  let status: 'Choosing' | 'Fetching' | 'Finished' = 'Choosing';
  let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  let bars: AlpacaBar[] = [];

  onDestroy(() => {
    if (reader) reader.cancel();
  });

  async function fetchHistoricalStock(symbol: string, startDate: Date, endDate: Date, timeframe: TimeFrame) {
    status = 'Fetching';
    bars = [];
    const response = await fetch('/api/fetchHistoricalStock', {
      method: 'POST',
      headers: {
        symbol: symbol,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        timeframe: timeframe,
      },
    });

    if (!response.ok || response.body === null) {
      throw new Error('Error initializing upload request.');
    }

    reader = response.body.getReader();
    const decoder = new TextDecoder();
    let unfinishedMsg = '';
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('Stream complete');
        break;
      }
      const msg = decoder.decode(value);
      const barsString = msg.split('\n');
      for (let barString of barsString) {
        if (barString === CSV_START || !barString) continue;
        if (!barString.endsWith('}')) {
          unfinishedMsg = barString;
          continue;
        }
        if (!barString.startsWith('{')) {
          barString = unfinishedMsg + barString;
          unfinishedMsg = '';
        }

        const bar: AlpacaBar = JSON.parse(barString);
        chartProps.xLabels.push(formatDate(bar.Timestamp, timeFrame.includes('Min') || timeFrame.includes('Hour')));
        chartProps.datasets[0].data.push(bar.ClosePrice);
        bars.push(bar);
      }
      chartProps = chartProps;
    }
    reader = null;
    status = 'Finished';
  }

  let chartProps: ChartProps = {
    xLabels: [],
    datasets: [
      {
        type: 'line',
        label: 'AAPL',
        data: [],
      },
    ],
  };

  function formatDate(timestamp: string, clocktime = false) {
    if (clocktime) {
      return new Date(timestamp).toLocaleDateString('de-DE', {
        month: 'numeric',
        year: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    } else {
      return new Date(timestamp).toLocaleDateString('de-DE', {
        month: 'numeric',
        year: 'numeric',
        day: 'numeric',
      });
    }
  }

  let symbol = 'AAPL';
  let startDate = '2021-01-01';
  let endDate = '2021-12-31';
  let timeFrame: any = '1Day';
  function onFetchButton() {
    if (!symbol || !startDate || !endDate || !timeFrame) {
      console.warn('Cannot fetch: Some input field is empty.');
      return;
    }
    fetchHistoricalStock(symbol, new Date(startDate), new Date(endDate), timeFrame);
  }

  function onResetButton() {
    status = 'Choosing';
    bars = [];
    chartProps = {
      xLabels: [],
      datasets: [
        {
          type: 'line',
          label: 'AAPL',
          data: [],
        },
      ],
    };
  }

  function onDownloadButton() {
    const text = toStockFileString(bars);
    const blob = new Blob([text], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${symbol}_${startDate}_${endDate}_${timeFrame}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<Navbar />

<div class="container">
  <h1 class="title">FetchCenter</h1>
  {#if status == 'Choosing'}
    <div class="select">
      <h2>Choose stock data</h2>
      <ul>
        <li class="inputItem">
          <p>Symbol:</p>
          <input bind:value={symbol} type="text" name="symbol" maxlength="5" placeholder="AAPL" />
        </li>
        <li class="inputItem">
          <p>Start date:</p>
          <input bind:value={startDate} type="text" name="symbol" maxlength="10" placeholder="2021-01-01" />
        </li>
        <li class="inputItem">
          <p>End date:</p>
          <input bind:value={endDate} type="text" name="symbol" maxlength="10" placeholder="2021-12-31" />
        </li>
        <li class="inputItem">
          <p>TimeFrame:</p>
          <select bind:value={timeFrame} class="timeframeOptions">
            <option value="1Min">1Min</option>
            <option value="5Min">5Min</option>
            <option value="15Min">15Min</option>
            <option value="30Min">30Min</option>
            <option value="1Hour">1Hour</option>
            <option value="1Day">1Day</option>
          </select>
        </li>
      </ul>
      <button on:click={onFetchButton}>Fetch data</button>
    </div>
  {:else}
    <h3>Status: {status} ({chartProps.xLabels.length})</h3>
    {#if status == 'Finished' || chartProps.xLabels.length < 10_000}
      <div class="chart">
        <SimpleChart {chartProps} />
      </div>
    {:else if chartProps.xLabels.length >= 10_000}
      <p class="tooManyPoints">Too many data points to display...<br />Continuing fetching data without showing graph.</p>
    {/if}

    {#if status == 'Finished'}
      <ul class="finishAction">
        <button on:click={onResetButton} id="reset">Reset</button>
        <button on:click={onDownloadButton} id="download">Download</button>
      </ul>
    {/if}
  {/if}
</div>

<style>
  .container {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .title {
    margin: 20px 0;
    font-size: 3rem;
  }

  .chart {
    margin: 10px;
    padding: 10px;
    background-color: white;
    border-radius: 10px;
    aspect-ratio: 2 / 1;
    width: 90vw;
    max-height: 50vh;
  }

  .select {
    padding: 10px;
    border-radius: 15px;
    background-color: #646464;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .select > h2 {
    text-align: center;
  }

  .inputItem {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 10px 0;
  }

  input {
    text-align: center;
  }

  .inputItem:last-child {
    margin-bottom: 0;
  }

  .select > button {
    color: #32cd32;
  }

  .select > button:hover {
    color: white;
    background-color: #32cd32;
  }

  .timeframeOptions {
    transform: translateX(-50%);
    padding: 5px;
    width: 100px;
    text-align: center;
    border-radius: 10px;
    border: 3px solid transparent;
    font-size: medium;
    outline: transparent;
    cursor: pointer;
  }

  .finishAction {
    display: flex;
    gap: 20px;
  }

  .finishAction > button {
    min-width: 200px;
  }

  #reset {
    color: #cd3232;
  }

  #reset:hover {
    color: white;
    background-color: #cd3232;
  }

  #download {
    color: #32cd32;
  }

  #download:hover {
    color: white;
    background-color: #32cd32;
  }

  .tooManyPoints {
    color: #ddb122;
    margin-top: 10vh;
    font-weight: bold;
    text-align: center;
  }
</style>
