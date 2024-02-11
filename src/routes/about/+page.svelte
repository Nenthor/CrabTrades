<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
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

<style>
  .div {
    margin-top: -75px;
    margin-left: -100px;
    position: fixed;
    top: 50%;
    left: 50%;
  }
</style>
