<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import { onMount } from 'svelte';

  /*
  const data = getHistoricalStockData(['GOOGL'], new Date('2000-01-01'), new Date('2024-02-10'), '1Min');
  const text = await toStockString(data);
  uploadFile('historical-stock-data', 'GOOGL.txt', text);
  console.log('File uploaded');
  */

  onMount(async () => {
    const response = await fetch('/api/uploadHistoricalData', {
      method: 'POST',
      headers: {
        symbol: 'AAPL',
        startDate: new Date('2021-01-01').toISOString(),
        endDate: new Date('2021-12-31').toISOString(),
        timeframe: '1Day',
      },
    });

    if (!response.ok || response.body === null) {
      throw new Error('Error initializing upload request.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('Stream complete');
        break;
      }

      const data = decoder.decode(value);

      console.log('Stream value:', data);
    }
  });
</script>

<Navbar />

<div class="container">Hello World!</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
