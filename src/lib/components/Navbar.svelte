<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  export let addHomeLink = true;

  const MARGIN = 50;
  const MOBILE_FLY_TRANSITION = 1000;
  let isOpen = false;
  let is_loading = true;
  let isMobileMenu = false;
  let total_width = 0,
    image_width = 0,
    list_width = 0;
  let redirect = '/';
  let isRoot = true;

  onMount(() => {
    setRedirect();
    window.addEventListener('resize', checkNavbarWidth);
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
    });
  });

  $: if (total_width != 0 && image_width != 0 && list_width != 0) {
    is_loading = false;
    checkNavbarWidth();
  }

  function onClick() {
    isOpen = !isOpen;
  }

  function checkNavbarWidth() {
    if (image_width + list_width + MARGIN >= total_width) isMobileMenu = true;
    else {
      if (isOpen) {
        onClick();
        setTimeout(() => {
          isMobileMenu = false;
        }, MOBILE_FLY_TRANSITION);
      } else isMobileMenu = false;
    }
  }

  function setRedirect() {
    isRoot = document.location.pathname != '/';
  }
</script>

<nav bind:offsetWidth={total_width}>
  <a bind:offsetWidth={image_width} data-sveltekit-reload href={redirect} id="title">
    <img id="crabtrader" alt="CrabTrader" src="/images/navbar.webp" width="383" height="214" />
  </a>
  {#if isMobileMenu}
    <button id="nav_toggle" aria-label="Open mobile menu" on:click={() => onClick()}>
      <span class="nav_bar {isOpen ? 'nav_bar_open' : ''}" />
      <span class="nav_bar {isOpen ? 'nav_bar_open' : ''}" />
      <span class="nav_bar {isOpen ? 'nav_bar_open' : ''}" />
    </button>
    {#if isOpen}
      <ul id="nav_list_open" transition:fly={{ y: -150, duration: MOBILE_FLY_TRANSITION }}>
        <slot />
        {#if isRoot && addHomeLink}
          <li><a href="/">Home</a></li>
        {/if}
      </ul>
    {/if}
  {:else}
    <ul class={is_loading ? 'loading' : ''} id="nav_list" bind:offsetWidth={list_width}>
      <slot />
      {#if isRoot && addHomeLink}
        <li><a href="/">Home</a></li>
      {/if}
    </ul>
  {/if}
</nav>

<style>
  nav {
    width: 100%;
    height: 75px;
    position: fixed;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    z-index: 99;
    overflow: hidden;
  }

  #title {
    height: 100%;
    width: 150px;
    margin-left: min(1vw, 20px);
  }

  #nav_list {
    list-style: none;
    color: #161616;
  }

  .loading {
    color: transparent !important;
  }

  #crabtrader {
    animation: none;
    object-fit: contain;
  }

  #crabtrader:hover {
    animation-name: crabdance;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  @keyframes crabdance {
    0% {
      transform: translateX(0) translateY(0) rotate(0deg);
    }
    12.5% {
      transform: translateX(-15px) translateY(-7px) rotate(30deg);
    }
    25% {
      transform: translateX(0) translatey(-10px) rotate(0deg);
    }
    37.5% {
      transform: translateX(15px) translateY(-7px) rotate(-360deg);
    }
    50% {
      transform: translateX(0) translateY(0px) rotate(0deg);
    }
    62.5% {
      transform: translateX(15px) translateY(-7px) rotate(-30deg);
    }
    75% {
      transform: translateX(0) translatey(-10px) rotate(0deg);
    }
    87.25% {
      transform: translateX(-15px) translateY(-7px) rotate(30deg);
    }
    100% {
      transform: translateX(0) translateY(0px) rotate(0deg);
    }
  }

  img {
    aspect-ratio: 383 / 214;
    max-height: 100%;
    max-width: 100%;
  }

  #nav_toggle {
    display: inline-block;
    cursor: pointer;
    margin: 0 15px;
    color: #161616;
    border: none;
    background-color: transparent;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }

  .nav_bar {
    display: block;
    width: 30px;
    height: 3px;
    background-color: #161616;
    margin: 6px 0;
    border-radius: 25px;
    transition:
      transform 0.3s ease-out,
      opacity 0.3s ease-out;
  }

  .nav_bar_open:nth-child(1) {
    transform: translateX(-5px) rotate(-45deg) translateY(12.5px);
  }

  .nav_bar_open:nth-child(2) {
    opacity: 0;
  }

  .nav_bar_open:nth-child(3) {
    transform: translateX(-5px) rotate(45deg) translateY(-12.5px);
  }

  #nav_list_open {
    display: flex;
    position: fixed;
    top: 75px;
    background-color: #333;
    width: 100%;
    animation: none;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  :global(#nav_list > li) {
    float: left;
    margin: 0 clamp(10px, 1vw, 15px);
    transition: transform 0.3s ease;
  }

  :global(#nav_list > li > a) {
    text-decoration: none;
    color: inherit;
    font-size: 1.25rem;
    text-align: center;
    font-weight: normal;
    transition: color 0.3s ease;
    padding: 50% 0;
  }

  :global(#nav_list > li > a:hover) {
    color: var(--primary);
    text-shadow: none;
  }

  :global(#nav_list_open > li) {
    height: fit-content;
    margin: 12.5px 0;
  }

  :global(#nav_list_open > li:hover) {
    transform: none;
  }

  :global(#nav_list_open > li > a) {
    text-decoration: none;
    color: white;
    font-size: 1.25rem;
    transition: color 0.3s ease;
  }

  :global(#nav_list_open > li > a:hover) {
    color: var(--primary);
    text-shadow: none;
  }
</style>
