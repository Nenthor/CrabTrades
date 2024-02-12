<script lang="ts">
  import SimpleChart from '$lib/components/SimpleChart.svelte';
  import type { ChartProps, StockData } from '$lib/types';
  import { onMount } from 'svelte';

  let showGraph = false;
  let chartProps: ChartProps = {
    xLabels: [],
    datasets: [
      {
        type: 'line',
        label: '',
        data: [],
      },
    ],
  };

  onMount(async () => {
    const response = await fetch('./stonks/AAPL_1_yahoo.txt');
    let tableTxt = await response.text();

    chartProps = {
      xLabels: [],
      datasets: [
        {
          type: 'line',
          label: '',
          data: [],
        },
      ],
    };

    chartProps = parseYahoo(tableTxt);

    // let entries: string[] = tableTxt.split('\n');
    // for (let i = 1; i < 2000; i++) {
    //   let entry: string[] = entries[i].split(',');
    //   let stock: StockData = {
    //     symbol: entry[0],
    //     date: new Date(entry[1]),
    //     open: parseFloat(entry[2]),
    //     high: parseFloat(entry[3]),
    //     low: parseFloat(entry[4]),
    //     close: parseFloat(entry[5]),
    //     volume: parseInt(entry[6]),
    //   };

    //   if (stock.date.getTime() <= new Date('2020/08/29').getTime()) {
    //     stock.close /= 4;
    //   }

    //   chartProps.xLabels.push(
    //     stock.date.toLocaleDateString('de-DE', {
    //       month: 'numeric',
    //       year: 'numeric',
    //       day: 'numeric',
    //     }),
    //   );
    //   chartProps.datasets[0].data.push(stock.close);
    //   chartProps.datasets[0].label = stock.symbol;
    // }

    showGraph = true;
  });

  function parseYahoo(tableTxt: string) {
    chartProps = {
      xLabels: [],
      datasets: [
        {
          type: 'line',
          label: '',
          data: [],
        },
        {
          type: 'bubble',
          label: '',
          data: [],
        },
      ],
    };

    let entries: string[] = tableTxt.split('\n');
    for (let i = 9000; i < entries.length; i++) {
      let entry: string[] = entries[i].split(',');
      let stock: StockData = {
        symbol: 'AAPL',
        date: new Date(entry[0]),
        open: parseFloat(entry[1]),
        high: parseFloat(entry[2]),
        low: parseFloat(entry[3]),
        close: parseFloat(entry[4]),
        volume: parseInt(entry[6]),
      };
      chartProps.xLabels.push(entry[0]);
      chartProps.datasets[0].data.push(stock.close);
      chartProps.datasets[0].label = 'APPLE LINIE';
      chartProps.datasets[1].data.push(stock.close / 2.0);
      chartProps.datasets[1].label = 'APPLE BUBBLE';
    }

    return chartProps;
  }
</script>

<div>
  {#if showGraph}
    <SimpleChart {chartProps} />
  {/if}
</div>

<style>
</style>
