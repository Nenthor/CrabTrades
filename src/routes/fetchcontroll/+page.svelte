<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import SimpleChart from '$lib/components/SimpleChart.svelte';
  import type { TimeFrame } from '$lib/server/Alpaca';
  import { CSV_START_CLIENT, type ChartProps } from '$lib/types';
  import type { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
  import { onMount } from 'svelte';

  /*
  const data = getHistoricalStockData(['GOOGL'], new Date('2000-01-01'), new Date('2024-02-10'), '1Min');
  const text = await toStockString(data);
  uploadFile('historical-stock-data', 'GOOGL.txt', text);
  console.log('File uploaded');
  */

  let stockData: string[] = [];

  async function fetchHistoricalStock(symbol: string, startDate: Date, endDate: Date, timeframe: TimeFrame) {
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

    const reader = response.body.getReader();
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
        if (barString === CSV_START_CLIENT || !barString) continue;
        if (!barString.endsWith('}')) {
          unfinishedMsg = barString;
          continue;
        }
        if (!barString.startsWith('{')) {
          barString = unfinishedMsg + barString;
          unfinishedMsg = '';
        }

        //console.log(barString);
        const bar: AlpacaBar = JSON.parse(barString);
        chartProps.xLabels.push(formatDate(bar.Timestamp));
        chartProps.datasets[0].data.push(bar.ClosePrice);
      }
      chartProps = chartProps;
    }
  }

  let chartProps: ChartProps = {
    xLabels: [],
    datasets: [
      {
        type: 'line',
        label: 'AAPL',
        data: [],
        color: '#e33',
      },
    ],
  };

  onMount(() => {
    fetchHistoricalStock('AAPL', new Date('2010-01-01'), new Date('2024-02-02'), '1Day');
  });

  function formatDate(timestamp: string) {
    return new Date(timestamp).toLocaleDateString('de-De', {
      month: 'numeric',
      year: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }
</script>

<Navbar />

<div class="container">
  <div class="chart">
    <SimpleChart {chartProps} />
  </div>
</div>

<style>
  .container {
    margin-top: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
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
</style>
