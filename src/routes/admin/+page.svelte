<script lang="ts">
  import FetchControll from '$lib/components/FetchControll.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <meta name="robots" content="noindex" />
</svelte:head>

<Navbar />

<main>
  <h1>Hey <span>{data.user.name}</span>, ready to crab?</h1>
  <div class="fetch">
    <FetchControll alpaca={data.alpaca}></FetchControll>
  </div>
</main>

<style>
  main {
    display: flex;
    align-items: start;
    justify-content: center;
    flex-wrap: wrap;
  }

  main > h1 {
    flex-basis: 100%;
    text-align: center;
    margin-top: 20px;
  }

  main > h1 > span {
    color: var(--primary);
  }

  .fetch {
    background-color: #323232;
    padding: 25px;
    border-radius: 25px;
  }
</style>
