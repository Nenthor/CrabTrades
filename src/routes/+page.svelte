<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';
  import ChartFromTable from '../lib/components/ChartFromTable.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  async function logout() {
    const req = await fetch('/api/logout', { method: 'POST' });
    if (req.ok) {
      invalidateAll(); // Reload the page
    }
  }
</script>

<Navbar>
  {#if data.isAuthanticated}
    <li><a href="/fetchcenter">FetchCenter</a></li>
  {/if}
  <li><a href="/about">About</a></li>
  {#if data.isAuthanticated}
    <li><a href="/logout" on:click|preventDefault={logout}>Logout</a></li>
  {:else}
    <li><a href="/login">Login</a></li>
  {/if}
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
