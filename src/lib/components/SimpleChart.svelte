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
      backgroundColor: dataset.backgroundColor,
      borderColor: `${dataset.backgroundColor?.slice(0, 7)}`,
      pointBorderWidth: 0,
      pointHoverRadius: 0,
      pointHoverBackgroundColor: dataset.backgroundColor,
      pointHoverBorderColor: 'rgba(220, 220, 220,1)',
      pointHoverBorderWidth: 0,
      pointRadius: dataset.pointRadius || 0,
      pointHitRadius: dataset.hitRadius || 0,
      data: dataset.data as any,
      radius: 10,
      order: dataset.type === 'line' ? 1 : 0,
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

    for (let i = 0; i < chartProps.datasets.length; i++) {
      chart.data.datasets[i].type = chartProps.datasets[i].type;
      chart.data.datasets[i].label = chartProps.datasets[i].label;
      chart.data.datasets[i].data = chartProps.datasets[i].data as any;
    }

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
