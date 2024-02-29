<script lang="ts">
  import type { HomepageStats } from '$lib/types';
  import { onMount } from 'svelte';

  export let homepageStats: HomepageStats;

  const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
  const profitFormatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const numberGrowFactor = 0.004321;
  const upTimeInDays = getUptime(homepageStats.uptime);

  let assetsValue = 0;
  let profit = 0;
  let orders = 0;
  let uptime = 0;

  function getUptime(start: Date) {
    return (new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24); // Uptime in days
  }

  onMount(() => {
    onNumberRisingEffect();
  });

  function onNumberRisingEffect() {
    let hasChanged = false;
    // AssetsValue
    if (assetsValue < homepageStats.assetsValue) {
      hasChanged = true;
      assetsValue = Math.min(assetsValue + homepageStats.assetsValue * numberGrowFactor, homepageStats.assetsValue);
    }

    // Orders
    if (orders < homepageStats.orders) {
      hasChanged = true;
      orders = Math.min(orders + homepageStats.orders * numberGrowFactor, homepageStats.orders);
    }

    // Winning Trades
    if (Math.abs(profit) < Math.abs(homepageStats.profit)) {
      hasChanged = true;
      let newProfit = profit + homepageStats.profit * numberGrowFactor;

      if (profit < homepageStats.profit) {
        profit = Math.min(newProfit, homepageStats.profit);
      } else {
        profit = Math.max(newProfit, homepageStats.profit);
      }
    }

    // Uptime
    if (uptime < upTimeInDays) {
      hasChanged = true;
      uptime = Math.min(uptime + upTimeInDays * numberGrowFactor, upTimeInDays);
    }

    if (hasChanged) {
      setTimeout(() => {
        onNumberRisingEffect();
      }, 1);
    }
  }
</script>

<div class="hero">
  <div class="title">
    <h1>CrabTrades</h1>
    <p>AI powered stock trading bot - Our first semester project</p>
    <a href="#chart">Explore More</a>
  </div>
  <img src="/images/crabtrader.webp" alt="CrabTrader" class="crabtrader" width="1024" height="1024" />
  <div class="stats">
    <div class="stat">
      <p class="statName">Assets value</p>
      <p class="statValue">{formatter.format(assetsValue)}</p>
      <img src="/images/svg/dollar-sign.svg" alt="dollar-sign" class="statImage" />
    </div>
    <div class="stat">
      <p class="statName">Profit</p>
      <p class="statValue">{profitFormatter.format(profit)}</p>
      <img src="/images/svg/percent.svg" alt="percent" class="statImage" />
    </div>
    <div class="stat">
      <p class="statName">Orders</p>
      <p class="statValue">{formatter.format(orders)}</p>
      <img src="/images/svg/scroll.svg" alt="scroll" class="statImage" />
    </div>
    <div class="stat">
      <p class="statName">Uptime</p>
      <p class="statValue">{formatter.format(uptime)}d</p>
      <img src="/images/svg/clock.svg" alt="clock" class="statImage" />
    </div>
    <div class="crabtrader-mobile" />
  </div>
</div>

<style>
  .hero {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 75px);
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: calc(100% - 100px) 100px;
    gap: 0;
    margin-bottom: 20px;
  }

  .title {
    grid-area: 1 / 1 / 2 / 2;
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    margin: 0 75px;
    z-index: 2;
  }

  .title > h1 {
    font-size: 3.5rem;
    font-weight: 800;
    letter-spacing: 10px;
    margin: 0;
    color: var(--primary);
    text-transform: uppercase;
  }

  .title > p {
    font-size: 1.4rem;
  }

  .title > a {
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

  .title > a:hover {
    background-color: var(--primary-dark);
  }

  .crabtrader {
    position: relative;
    grid-area: 1 / 2 / 2 / 3;
    aspect-ratio: 1 / 1;
    max-height: calc(100vh - 200px);
    max-width: 50vw;
    width: auto;
    margin-top: 20px;
    margin-right: 20px;
    border-radius: 40px;
    justify-self: end;
    box-shadow: 12px 30px 80px 0px #000c;
  }

  .crabtrader-mobile {
    display: none;
  }

  .stats {
    grid-area: 2 / 1 / 3 / 3;
    background-image: linear-gradient(to bottom, #0000 0%, #111a 50%, #0000 100%);
    transform: translateY(-75px);
    z-index: 1;
    display: flex;
    justify-content: space-evenly;
    align-items: start;
    flex-wrap: wrap;
    gap: 20px;
    margin: 0 20px;
  }

  .stat {
    background-color: var(--secondary);
    height: 150px;
    flex-grow: 1;
    flex-basis: 0;
    min-width: 280px;
    max-width: 400px;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    box-shadow: 12px 30px 80px 0px #000c;
  }

  .stat:first-child > img {
    transform: translateX(20px);
  }

  .statName {
    font-size: 1.5rem;
    margin: 10px;
    text-align: center;
    width: calc(100% - 100px);
  }

  .statValue {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 0 10px 10px 10px;
    text-align: center;
    width: calc(100% - 100px);
  }

  .statImage {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100px;
    height: 100px;
    margin: 0 10px 10px 0;
    opacity: 0.3;
  }

  @media (max-width: 1350px) or (max-height: 650px) {
    .hero {
      grid-template-rows: 40% 60%;
    }

    .title {
      text-align: center;
      margin: 0;
      align-items: center;
      grid-area: 1 / 1 / 2 / 3;
    }

    .crabtrader {
      display: none;
    }

    .crabtrader-mobile {
      aspect-ratio: 1 / 1;
      position: absolute;
      z-index: -1;
      display: block;
      background-image: url('/images/crabtrader.webp');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      box-shadow: 0 0 5px 30px #161616 inset;
      border-radius: 50%;
      max-width: 100%;
      height: 100%;
      filter: blur(2px);
    }

    .stats {
      transform: translateY(0);
      background-image: none;
      gap: 20px;
      align-items: center;
    }

    .stat {
      min-width: calc(50vw - 40px);
      flex-basis: 50%;
    }

    .stat:first-child > img {
      transform: none;
    }

    .title > h1 {
      font-size: clamp(1.7rem, 9vw, 3.5rem);
    }

    .title > p {
      margin: 0 10px;
      font-size: clamp(1rem, 3vw, 1.4rem);
    }
  }

  @media (max-width: 900px) {
    .hero {
      grid-template-rows: 30% 70%;
    }

    .crabtrader-mobile {
      display: none;
    }

    .stat {
      min-width: calc(75vw - 40px);
      height: 100px;
      flex-basis: 100%;
    }

    .statImage {
      width: 75px;
      height: 75px;
    }
  }

  @media (hover: none) {
    .title > a:hover {
      background-color: var(--primary);
    }
  }
</style>
