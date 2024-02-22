<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';
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
  {#if data.isAuthanticated}
    <li><a href="/logout" on:click|preventDefault={logout}>Logout</a></li>
  {:else}
    <li><a href="/login">Login</a></li>
  {/if}
</Navbar>

<main>
  <div class="hero">
    <div class="title">
      <div class="titlebox">
        <h1>CrabTrades</h1>
        <p>AI powered stock trading bot - Our first semester project</p>
        <a href="/#explore">Explore More</a>
      </div>
    </div>
    <img src="/images/crabtrader.webp" alt="CrabTrader" class="crabtrader" />
    <div class="stats">
      <div class="stat">
        <p class="statName">Assets value</p>
        <div class="statRedBox">
          <p class="statValue">$100,000</p>
        </div>
      </div>
      <div class="stat">
        <p class="statName">Orders</p>
        <div class="statRedBox">
          <p class="statValue">153</p>
        </div>
      </div>
      <div class="stat">
        <p class="statName">Winning trades</p>
        <div class="statRedBox">
          <p class="statValue">10%</p>
        </div>
      </div>
      <div class="stat">
        <p class="statName">Uptime</p>
        <div class="statRedBox">
          <p class="statValue">10d</p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    margin-top: 75px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero {
    position: relative;
    width: 100%;
    height: calc(100vh - 75px);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 90% 10%;
    gap: 0;
  }

  .title {
    grid-area: 1 / 1 / 2 / 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .titlebox {
    width: 100%;
    margin: 0 50px;
  }

  .titlebox > h1 {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: 10px;
    margin: 0;
    color: var(--primary);
    text-transform: uppercase;
  }

  .titlebox > p {
    font-size: 1.4rem;
  }

  .titlebox > a {
    display: inline-block;
    padding: 12px 75px;
    background-color: var(--primary);
    color: white;
    text-decoration: none;
    margin-top: 40px;
    border-radius: 50px;
    transition: background-color 0.2s;
    font-weight: bold;
  }

  .titlebox > a:hover {
    background-color: var(--primary-dark);
  }

  .crabtrader {
    position: relative;
    grid-area: 1 / 2 / 2 / 3;
    height: 100%;
    margin-top: 15px;
    margin-right: 15px;
    border-radius: 40px;
    justify-self: end;
    box-shadow: 12px 30px 80px 0px #000c;
  }

  .stats {
    grid-area: 2 / 1 / 3 / 3;
    background-image: linear-gradient(to bottom, #0000 0%, #111a 50%, #0000 100%);
    z-index: 1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transform: translateY(-50%);
    height: 200%;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    min-width: 250px;
    width: 15%;
    height: calc(100% - 20px);
    max-height: 175px;
    margin-bottom: 20px;
    border-radius: 10px;
    gap: 10px;
  }

  .statName {
    flex-grow: 1;
    transform: translateY(50%);
    font-size: 1.5rem;
    text-align: center;
    font-weight: bold;
    color: #161616;
  }

  .statRedBox {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to bottom right, var(--secondary-dark) 0%, var(--secondary) 50%, var(--secondary-dark) 100%);
    width: calc(100% - 10px);
    text-align: center;
    padding: 15px 0;
    border-radius: 0 0 10px 10px;
    border: 5px solid white;
  }

  .statValue {
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
  }
</style>
