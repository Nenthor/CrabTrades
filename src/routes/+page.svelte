<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import ChartFromTable from '../lib/components/ChartFromTable.svelte';
</script>

<Navbar>
  <li><a href="/fetchcontroll">FetchControll</a></li>
  <li><a href="/about">About</a></li>
</Navbar>

<main>
  <h1>CrabTrades</h1>

  <p>Your favorite AI-Stock-Trader</p>

  <div class="chart">
    <ChartFromTable />
  </div>
</main>

<style>
  h1 {
    color: var(--crabred);
  }
  .chart {
    width: 720px;
    height: 365px;
    background-color: white;
    border-radius: 10px;
    margin: 15px;
  }

  main {
    margin-top: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
