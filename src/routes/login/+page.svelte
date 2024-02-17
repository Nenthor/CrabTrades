<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte';

  const PUBLIC_KEY = '6LdalHYpAAAAALwDRRTBJIoHTEhYqvly0kR2oJ2y';

  let username: string;
  let password: string;
  let type = 'none';
  let message = '';

  async function onSubmit() {
    // @ts-ignore ignore grecaptcha not found
    const token = await grecaptcha.execute(PUBLIC_KEY, { action: 'LOGIN' });

    const form = new FormData();
    form.append('username', username);
    form.append('password', password);
    form.append('token', token);

    const response = await fetch('/api/login', {
      method: 'POST',
      body: form,
    });

    // Update the message and type from the response
    const data = await response.json();
    type = data.type;
    message = data.message;
  }
</script>

<svelte:head>
  <script src="https://www.google.com/recaptcha/api.js?render={PUBLIC_KEY}" async defer></script>
</svelte:head>

<Navbar />

<main>
  <h1>Login</h1>
  <form method="post" on:submit|preventDefault={onSubmit}>
    <label for="username">Username</label>
    <input bind:value={username} type="text" id="username" name="username" required autocomplete="off" />
    <label for="password">Password</label>
    <input bind:value={password} type="password" id="password" name="password" required />
    {#if type === 'error' || type === 'success'}
      <p class={type}>{message}</p>
    {/if}
    <button type="submit">Login</button>
  </form>
</main>

<style>
  h1 {
    color: var(--crabred);
  }

  main {
    margin-top: 100px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    background-color: #646464;
    padding: 20px;
    gap: 10px;
    border-radius: 20px;
  }
</style>
