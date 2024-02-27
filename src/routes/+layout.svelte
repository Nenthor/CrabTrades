<slot />

<style global>
  @font-face {
    font-family: 'montserrat';
    src: url(/fonts/montserrat/montserrat.woff2) format('woff2');
    font-display: swap;
  }

  :root {
    --primary: #dd452b;
    --primary-light: #f47963;
    --primary-dark: #b42f17;
    --secondary: #3bc98f;
    --secondary-light: #5de6a6;
    --secondary-dark: #2a9f6d;
    --success: #32cd32;
    --error: #cd3232;
  }

  * {
    margin: 0;
    padding: 0;
    font-family: montserrat;
  }

  html {
    min-height: 100%;
    width: 100%;
  }

  body {
    min-height: 100%;
    width: 100%;
    background-color: #161616;
    position: relative;
  }

  main {
    margin-top: 75px;
    width: 100%;
    height: calc(100vh - 75px);
    overflow-y: auto;
    scroll-behavior: smooth;
  }

  a {
    -webkit-user-drag: none;
  }

  a:visited {
    text-decoration: none;
  }

  div,
  button {
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  }

  p,
  a,
  h1,
  h2,
  h3,
  h4,
  h5 {
    color: white;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #323232;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-image: linear-gradient(var(--primary-dark), var(--primary-light));
  }

  ::-webkit-scrollbar-thumb:hover {
    background-image: linear-gradient(var(--primary-dark), var(--primary));
  }

  input {
    padding: 5px;
    border-radius: 10px;
    border: 3px solid transparent;
    font-size: medium;
    outline: transparent;
  }

  input:focus {
    border: 3px solid #4d92d8;
  }

  button {
    padding: 10px 25px;
    border-radius: 50px;
    background-color: white;
    text-align: center;
    font-weight: bold;
    font-size: large;
    border: none;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    main {
      scroll-behavior: auto !important;
    }
  }
</style>
