<script lang="ts">
  import type { ChartProps } from '$lib/types';
  import SimpleChart from './SimpleChart.svelte';

  let chartProps1: ChartProps = {
    xLabels: [
      new Date('2020-01-01').toISOString(),
      new Date('2020-02-01').toISOString(),
      new Date('2020-03-01').toISOString(),
      new Date('2020-04-01').toISOString(),
      new Date('2020-05-01').toISOString(),
    ],
    datasets: [
      {
        type: 'line',
        label: 'X',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
    ],
  };

  let chartProps2: ChartProps = {
    xLabels: [
      new Date('2020-01-01').toISOString(),
      new Date('2020-02-01').toISOString(),
      new Date('2020-03-01').toISOString(),
      new Date('2020-04-01').toISOString(),
      new Date('2020-06-01').toISOString(),
    ],
    datasets: [
      {
        type: 'line',
        label: 'AAPL',
        data: [42, 100, 50, 60, 40, 35, 20],
      },
    ],
  };

  let charts: ChartProps[] = [chartProps2, chartProps1, chartProps2, chartProps2];

  function onChartClick(index: number) {
    if (index === 1) return;

    if (index === 0) {
      const first = charts.splice(0, 1)[0];
      if (first) charts.push(first);
    } else if (index === 2) {
      const last = charts.splice(charts.length - 1, 1)[0];
      if (last) charts.unshift(last);
    }

    charts = charts;
  }
</script>

<div id="chart">
  <h2 class="title">AI trading history</h2>
  <ul class="charts">
    {#each charts as chart, index}
      <button on:click={() => onChartClick(index)} class="chart">
        <SimpleChart chartProps={chart} />
      </button>
    {/each}
  </ul>
</div>

<style>
  #chart {
    padding: 75px 0;
    width: 100%;
    /* From https://css-generators.com/wavy-shapes/ */
    --mask: radial-gradient(111.8px at 50% 150px, #000 99%, #0000 101%) calc(50% - 100px) 0/200px 51% repeat-x,
      radial-gradient(111.8px at 50% -100px, #0000 99%, #000 101%) 50% 50px/200px calc(51% - 50px) repeat-x,
      radial-gradient(111.8px at 50% calc(100% - 150px), #000 99%, #0000 101%) calc(50% - 100px) 100%/200px 51% repeat-x,
      radial-gradient(111.8px at 50% calc(100% + 100px), #0000 99%, #000 101%) 50% calc(100% - 50px) / 200px calc(51% - 50px) repeat-x;
    -webkit-mask: var(--mask);
    mask: var(--mask);
    background-image: linear-gradient(to bottom, var(--secondary-dark), var(--secondary-light));
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .title {
    font-size: 3rem;
    color: var(--primary-light);
    background-color: white;
    padding: 75px 50px 20px 50px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    transform: translateY(-75px);
  }

  .charts {
    position: relative;
    gap: 30px;
    padding: 30px;
    height: 500px;
    width: calc(100% - 60px);
  }

  .chart {
    position: absolute;
    width: 700px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-shadow: 5px 5px 50px 0px #161616cc;
    border-radius: 20px;
    padding: 15px;
    display: none;
    top: 50%;
    left: 50%;
  }

  .chart:nth-child(1) {
    display: inline;
    transform: translate(-50%, -50%) translateX(-730px) perspective(50em) rotateY(-45deg) scale(0.72) translateX(75px);
    z-index: 1;
  }

  .chart:nth-child(1)::after,
  .chart:nth-child(3)::after {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    opacity: 0.8;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url('/images/svg/arrow.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .chart:nth-child(2) {
    display: inline;
    transform: translate(-50%, -50%);
    z-index: 2;
    cursor: auto;
  }

  .chart:nth-child(3) {
    display: inline;
    transform: translate(-50%, -50%) translateX(730px) perspective(50em) rotateY(45deg) scale(0.72) translateX(-75px);
    z-index: 1;
  }

  .chart:nth-child(3)::after {
    transform: translate(-50%, -50%) rotateY(180deg) !important;
  }
</style>
