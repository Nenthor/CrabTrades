<script lang="ts">
  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />

<main>
  <div class="box">
    <h1>{$page.status}: {$page.error?.message}</h1>
    <img alt="Error" src="/images/error.webp" width="506" height="411" />
  </div>
</main>

<style>
  .box {
    margin-top: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
  }
  h1 {
    font-size: clamp(2rem, 10vw, 4rem);
    color: var(--error);
    text-align: center;
  }
  img {
    width: 90%;
    max-width: 506px;
    height: auto;
  }
</style>
