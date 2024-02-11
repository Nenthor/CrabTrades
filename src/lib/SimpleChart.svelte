<script lang="ts">
  import Chart from 'chart.js/auto';
  import { onMount } from 'svelte';
  import type { ChartProps } from './Types';

  import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineController,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
    type ChartData,
  } from 'chart.js';

  ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController);

  export let chartProps: ChartProps;

  let canvas: HTMLCanvasElement;

  const datasets: ChartData['datasets'] = [];
  chartProps.datasets.forEach((dataset) => {
    datasets.push({
      type: dataset.type,
      label: dataset.label,
      fill: true,
      backgroundColor: '#e0333333',
      borderColor: '#e03333',
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
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartProps.xLabels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'category',
              labels: chartProps.xLabels,
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    width: 100%;
    height: 100%;
  }
</style>
