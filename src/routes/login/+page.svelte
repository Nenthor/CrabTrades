<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';
  import { onDestroy, onMount } from 'svelte';

  const PUBLIC_KEY = '6LdalHYpAAAAALwDRRTBJIoHTEhYqvly0kR2oJ2y';

  let addHomeLink = false;
  let username: string;
  let password: string;
  let type = 'none';
  let message = '';

  let disabled = false;
  let autoFocusElement: HTMLInputElement;
  let form: HTMLFormElement;
  let animation: NodeJS.Timeout;

  onMount(() => {
    autoFocusElement.focus();
    animation = startCircleAnimation();
  });

  onDestroy(() => {
    if (animation) clearInterval(animation);
  });

  async function onSubmit() {
    disabled = true;
    // @ts-ignore ignore grecaptcha not found
    const token = await grecaptcha.execute(PUBLIC_KEY, { action: 'LOGIN' });

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        username,
        password,
        token,
      },
    });

    // Update the message and type from the response
    const data = await response.json();
    type = data.type;
    message = data.message;
    disabled = false;

    if (type === 'success') {
      // Redirect to the home page. Full reload to remove recaptcha script
      document.location.href = '/';
    }
  }

  function startCircleAnimation() {
    let x = 0;
    let y = 0;
    const r = 50;
    return setInterval(() => {
      x = Math.sin(Date.now() / 1000);
      y = Math.cos(Date.now() / 1000);
      form.style.boxShadow = `${x * r}px ${y * r}px 200px #646464`;
    }, 1000 / 60);
  }

  function onHomeLink() {
    document.location.href = '/';
  }
</script>

<svelte:head>
  <script src="https://www.google.com/recaptcha/api.js?render={PUBLIC_KEY}" async defer></script>
</svelte:head>

<Navbar {addHomeLink}>
  <li><a href="/" on:click|preventDefault={onHomeLink}>Home</a></li>
</Navbar>

<main>
  <form method="post" bind:this={form} on:submit|preventDefault={onSubmit}>
    <h1>Login</h1>
    <p>Enter your username and password for unlimited access to CrabTrades.com!</p>
    <div>
      <label for="username">Username:</label>
      <input bind:value={username} bind:this={autoFocusElement} type="text" required autocomplete="off" />
    </div>
    <div>
      <label for="password">Password:</label>
      <input bind:value={password} type="password" required />
    </div>

    {#if type === 'error' || type === 'success'}
      <p class={type}>{message}</p>
    {/if}
    <button type="submit" {disabled}>Login</button>
  </form>
</main>

<style>
  h1 {
    color: var(--crabred);
    text-transform: uppercase;
  }

  main {
    margin-top: 100px;
    width: 100%;
    min-height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    background-color: #646464;
    padding: 15px;
    margin: 0 10px;
    gap: 20px;
    border-radius: 25px;
    max-width: 400px;
    box-shadow: 0 0 200px #646464;
  }

  form > p {
    text-align: center;
  }

  form > div {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    gap: 5px;
  }

  form > div > label {
    font-weight: bold;
  }

  form > div > input {
    width: 50%;
    text-align: center;
  }

  form > button {
    color: #32cd32;
    width: 75%;
  }

  form > button:hover {
    color: white;
    background-color: #32cd32;
  }

  .error {
    color: #cd3232;
  }

  .success {
    color: #32cd32;
  }

  @media (max-width: 400px) {
    form > div {
      flex-direction: column;
    }

    form > div > input {
      width: 100%;
    }

    form > button {
      width: 90%;
    }
  }
</style>
