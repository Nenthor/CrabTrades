<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import HomepageAbout from '$lib/components/HomepageAbout.svelte';
  import HomepageChart from '$lib/components/HomepageChart.svelte';
  import HomepageHero from '$lib/components/HomepageHero.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const homepageStats = data.homepageStats;

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
  {#if data.isAuthanticated}
    <li><a href="/logout" on:click|preventDefault={logout}>Logout</a></li>
  {:else}
    <li><a href="/login">Login</a></li>
  {/if}
</Navbar>

<main>
  <HomepageHero {homepageStats} />
  <HomepageChart />
  <HomepageAbout />
</main>

<style>
  main {
    margin-top: 75px;
    width: 100%;
  }
</style>
