<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  //import Crabbase from '$lib/server/Crabbase.ts';

  function testWrite() {
    alert('write complete');
  }

  function testRead() {
    alert('read complete');
  }
</script>

<div class="container">
  <Navbar>
    <li><a href="/about">About</a></li>
  </Navbar>

  <h1>About us</h1>

  <p>Expirimental speculative algorithm for stocks</p>
  <img
    class="div"
    src="https://cdn.discordapp.com/attachments/1203647179080728610/1205985808402616340/image.png?ex=65da5cce&is=65c7e7ce&hm=ba09e76acdf61bfb2fd590de6a56804202744a76e7d3ad54f295b5bdde85c743&"
    alt=""
    width="200"
    height="150" />
</div>

<button on:click={testWrite}>test write</button>

<button on:click={testRead}>test read</button>

<style>
  .div {
    margin-top: -75px;
    margin-left: -100px;
    position: fixed;
    top: 50%;
    left: 50%;
  }
</style>
