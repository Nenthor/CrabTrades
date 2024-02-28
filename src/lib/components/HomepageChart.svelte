<script lang="ts">
  import type { ChartProps } from '$lib/types';
  import SimpleChart from './SimpleChart.svelte';

  const DURATION = 0.75; // s

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

  let charts: ChartProps[] = [chartProps2, chartProps1, chartProps2, chartProps1];
  let isAnimating = false;
  function onChartClick(index: number) {
    if (index === 1 || isAnimating) return;
    isAnimating = true;

    // Animate the charts
    const chart0 = document.getElementById('chart0');
    const chart1 = document.getElementById('chart1');
    const chart2 = document.getElementById('chart2');
    const chart3 = document.getElementById('chart3');
    const chartLast = document.getElementById(`chart${charts.length - 1}`);

    if (index === 0) {
      chart0?.classList.add('leftToVoid');
      chart1?.classList.add('middleToLeft');
      chart2?.classList.add('rightToMiddle');
      chart3?.classList.add('voidToRight');
      if (chart3) chart3.style.display = 'inline';
    } else if (index === 2) {
      chartLast?.classList.add('voidToLeft');
      chart0?.classList.add('leftToMiddle');
      chart1?.classList.add('middleToRight');
      chart2?.classList.add('rightToVoid');
      if (chartLast) chartLast.style.display = 'inline';
    }

    setTimeout(() => {
      // Remove the animation classes
      if (index === 0) {
        chart0?.classList.remove('leftToVoid');
        chart1?.classList.remove('middleToLeft');
        chart2?.classList.remove('rightToMiddle');
        chart3?.classList.remove('voidToRight');
        if (chart3) chart3.style.display = 'none';
      } else if (index === 2) {
        chartLast?.classList.remove('voidToLeft');
        chart0?.classList.remove('leftToMiddle');
        chart1?.classList.remove('middleToRight');
        chart2?.classList.remove('rightToVoid');
        if (chartLast) chartLast.style.display = 'none';
      }

      // Update the charts array
      if (index === 0) {
        const first = charts.shift();
        if (first) charts.push(first);
      } else if (index === 2) {
        const last = charts.pop();
        if (last) charts.unshift(last);
      }
      charts = charts;
      isAnimating = false;
    }, DURATION * 1000);
  }
</script>

<div id="chart">
  <h2 class="title">AI trading history</h2>
  <ul class="charts">
    {#each charts as chart, index}
      <button on:click={() => onChartClick(index)} id="chart{index}" class="chart">
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
    text-align: center;
  }

  .charts {
    position: relative;
    gap: 30px;
    padding: 0 30px 0px 30px;
    height: 500px;
    width: calc(100% - 60px);
    transform: translateY(-30px);
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

  #chart0 {
    display: inline;
    transform: translate(-50%, -50%) translateX(-730px) perspective(50em) rotateY(-45deg) scale(0.72) translateX(75px);
    z-index: 1;
  }

  #chart0::after,
  #chart2::after,
  :global(.voidToLeft::after),
  :global(.voidToRight::after),
  :global(.middleToLeft::after),
  :global(.middleToRight::after) {
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

  #chart1 {
    display: inline;
    transform: translate(-50%, -50%);
    z-index: 2;
    cursor: auto;
  }

  #chart2 {
    display: inline;
    transform: translate(-50%, -50%) translateX(730px) perspective(50em) rotateY(45deg) scale(0.72) translateX(-75px);
    z-index: 1;
  }

  #chart2::after,
  :global(.voidToRight::after),
  :global(.middleToRight::after) {
    transform: translate(-50%, -50%) rotateY(180deg) !important;
  }

  :global(.middleToLeft::after),
  :global(.middleToRight::after) {
    animation: arrowFadeIn 0.5s ease-in 0s 1 normal forwards;
  }

  :global(.leftToVoid) {
    animation: 0.75s linear 0s 1 normal forwards running leftToVoid;
  }

  :global(.middleToLeft) {
    animation: 0.75s linear 0s 1 normal forwards running middleToLeft;
  }

  :global(.rightToMiddle) {
    animation: 0.75s linear 0s 1 normal forwards running rightToMiddle;
  }

  :global(.rightToMiddle::after) {
    transition: opacity 0.5s linear;
    opacity: 0 !important;
  }

  :global(.voidToRight) {
    animation: 0.75s linear 0s 1 normal forwards running voidToRight;
  }

  :global(.voidToLeft) {
    animation: 0.75s linear 0s 1 reverse forwards running leftToVoid;
  }

  :global(.leftToMiddle) {
    animation: 0.75s linear 0s 1 reverse forwards running middleToLeft;
  }

  :global(.leftToMiddle::after) {
    transition: opacity 0.5s linear;
    opacity: 0 !important;
  }

  :global(.middleToRight) {
    animation: 0.75s linear 0s 1 reverse forwards running rightToMiddle;
  }

  :global(.rightToVoid) {
    animation: 0.75s linear 0s 1 reverse forwards running voidToRight;
  }

  @keyframes arrowFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.8;
    }
  }

  @keyframes leftToVoid {
    from {
      transform: translate(-50%, -50%) translateX(-730px) perspective(50em) rotateY(-45deg) scale(0.72) translateX(75px);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) translateX(-830px) perspective(50em) rotateY(-90deg) scale(0.72) translateX(75px);
      opacity: 0;
    }
  }

  @keyframes middleToLeft {
    from {
      transform: translate(-50%, -50%);
    }
    to {
      transform: translate(-50%, -50%) translateX(-730px) perspective(50em) rotateY(-45deg) scale(0.72) translateX(75px);
    }
  }

  @keyframes rightToMiddle {
    from {
      transform: translate(-50%, -50%) translateX(730px) perspective(50em) rotateY(45deg) scale(0.72) translateX(-75px);
    }
    to {
      transform: translate(-50%, -50%);
    }
  }

  @keyframes voidToRight {
    from {
      transform: translate(-50%, -50%) translateX(830px) perspective(50em) rotateY(90deg) scale(0.72) translateX(-75px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) translateX(730px) perspective(50em) rotateY(45deg) scale(0.72) translateX(-75px);
      opacity: 1;
    }
  }
</style>
