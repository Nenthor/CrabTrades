<script lang="ts">
  import type { ChartProps } from '$lib/types';
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
  import Chart from 'chart.js/auto';
  import 'chartjs-adapter-luxon';
  import { onMount } from 'svelte';

  ChartJS.register(LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Tooltip, LineController, BarController);

  export let chartProps: ChartProps;

  let canvas: HTMLCanvasElement;
  let chart: ChartJS;

  $: updateChart(chartProps);

  const datasets: ChartData['datasets'] = [];
  chartProps.datasets.forEach((dataset) => {
    datasets.push({
      type: dataset.type,
      label: dataset.label,
      fill: true,
      backgroundColor: dataset.backgroundColor, // primary-dark with 44 alpha
      borderColor: '#dd452b', // primary
      pointBorderWidth: 0,
      pointHoverRadius: 0,
      pointHoverBackgroundColor: dataset.hoverBackgroundColor,
      pointHoverBorderColor: 'rgba(220, 220, 220,1)',
      pointHoverBorderWidth: 0,
      pointRadius: dataset.pointRadius,
      pointHitRadius: 7,
      data: dataset.data as any,
      radius: 10,
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
    chart.data.datasets[0].data = chartProps.datasets[0].data as any;
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
