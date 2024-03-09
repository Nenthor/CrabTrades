<script lang="ts">
  import type { ChartProps } from '$lib/types';
  import {
    BubbleController,
    Chart,
    Filler,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    TimeScale,
    Tooltip,
    type ChartData,
  } from 'chart.js';
  import 'chartjs-adapter-luxon';
  import { onMount } from 'svelte';

  Chart.register(LineController, LineElement, BubbleController, PointElement, TimeScale, LinearScale, Filler, Legend, Tooltip);

  export let chartProps: ChartProps;

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  $: updateChart(chartProps);

  const datasets: ChartData['datasets'] = [];
  chartProps.datasets.forEach((dataset) => {
    datasets.push({
      type: dataset.type,
      label: dataset.label,
      fill: true,
      backgroundColor: '#b42f1744', // primary-dark with 44 alpha
      borderColor: '#d73d23', // primary
      pointBorderWidth: 0,
      pointHoverRadius: 0,
      pointHoverBackgroundColor: 'rgb(0, 0, 0)',
      pointHoverBorderColor: 'rgba(220, 220, 220,1)',
      pointHoverBorderWidth: 0,
      pointRadius: 0,
      pointHitRadius: 7,
      data: dataset.data,
      radius: 50,
    });
  });

  onMount(() => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: datasets,
          labels: chartProps.xLabels,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 0,
          },
          scales: {
            x: {
              type: 'time',
              time: {
                tooltipFormat: 'DD T',
              },
            },
          },
        },
      });
    }
  });

  function updateChart(chartProps: ChartProps) {
    if (!chartProps || !chart) return;
    chart.data.datasets[0].label = chartProps.datasets[0].label;
    chart.data.datasets[0].data = chartProps.datasets[0].data;
    chart.data.labels = chartProps.xLabels;
    chart.update();
  }
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
