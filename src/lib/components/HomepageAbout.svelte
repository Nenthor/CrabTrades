<script lang="ts">
  interface SoftwareItem {
    name: string;
    logo: string;
    text: string;
  }

  const softwareItems: SoftwareItem[] = [
    {
      name: 'Google Cloud',
      logo: '/images/svg/software/google-cloud.svg',
      text: 'Hosted on Google Cloud',
    },
    {
      name: 'Cloud Run',
      logo: '/images/svg/software/cloud-run.svg',
      text: 'Running our containerized server',
    },
    {
      name: 'Compute Engine',
      logo: '/images/svg/software/compute-engine.svg',
      text: 'Executes AI stock trading model',
    },
    {
      name: 'Cloud Build',
      logo: '/images/svg/software/cloud-build.svg',
      text: 'Continuous deployment with GitHub pipeline',
    },
    {
      name: 'Firestore',
      logo: '/images/svg/software/firestore.svg',
      text: 'Stores our trading orders',
    },
    {
      name: 'Firebase Hosting',
      logo: '/images/svg/software/firebase.svg',
      text: 'Free way to access our server on the web',
    },
    {
      name: 'Alpaca',
      logo: '/images/svg/software/alpaca.svg',
      text: 'Paper trading API & historical data',
    },
    {
      name: 'TensorFlow',
      logo: '/images/svg/software/tensorflow.svg',
      text: 'Building our AI stock trading model',
    },
    {
      name: 'SvelteKit',
      logo: '/images/svg/software/sveltekit.svg',
      text: 'Used as our frontend framework. Simple and fast',
    },
    {
      name: 'Cloudflare',
      logo: '/images/svg/software/cloudflare.svg',
      text: 'Protection layer for our website',
    },
    {
      name: 'AI-Images',
      logo: '/images/svg/software/ai-images.svg',
      text: 'Used AI to generate images',
    },
    {
      name: 'Chart.js',
      logo: '/images/svg/software/chartjs.svg',
      text: 'Creating our stock charts',
    },
    {
      name: 'JWToken',
      logo: '/images/svg/software/jwt.svg',
      text: 'Admin authentication without server component',
    },
    {
      name: 'Node.js',
      logo: '/images/svg/software/nodejs.svg',
      text: 'Running JavaScript on the server-side',
    },
    {
      name: 'TypeScript',
      logo: '/images/svg/software/typescript.svg',
      text: 'Type safety for our code',
    },
  ];
</script>

<div id="about">
  <h2 class="title">About</h2>
  <p class="description">
    CrabTrades is our semester break project, having just finished the first semester of our computer science degree at Munich University of Applied
    Sciences. So there are probably a million ways to make it better, but perfection wasn't our goal - it was about getting in touch with new
    technologies, challenging ourselves and of course having fun.
  </p>
  <div class="box">
    <div class="software">
      <h3>Created with</h3>
      <ul>
        {#each softwareItems as item}
          <li class="softwareItem">
            <img class="side" src={item.logo} alt={item.name} />
            <div class="side">
              <p class="softwareTitle">{item.name}</p>
              <p class="softwareText">{item.text}</p>
            </div>
          </li>
        {/each}
      </ul>
    </div>
    <div class="team">
      <h3>Team</h3>
      <ul>
        <li class="connection" />
        <li class="member">
          <a href="https://github.com/vbielov" target="_blank">
            <img src="https://github.com/vbielov.png?size=100" alt="Bielov GitHub Icon" title="Click Me!" />
            <p>Bielov</p>
          </a>
        </li>
        <li class="member">
          <a href="https://github.com/Nentwix" target="_blank">
            <img src="https://github.com/nentwix.png?size=100" alt="Nentwix GitHub Icon" title="Click Me!" />
            <p>Nentwix</p>
          </a>
        </li>
        <li class="member">
          <a href="https://github.com/lvl10Gopnik" target="_blank">
            <img src="https://github.com/lvl10gopnik.png?size=100" alt="lvl10Gopnik GitHub Icon" title="Click Me!" />
            <p>lvl10Gopnik</p>
          </a>
        </li>
      </ul>
    </div>
    <div class="github">
      <h3>Source Code</h3>
      <a href="https://github.com/Nentwix/CrabTrades" target="_blank">
        <img src="/images/svg/software/github.svg" alt="GitHub Project" title="Click Me!" />
        <p>CrabTrades</p>
      </a>
    </div>
  </div>
</div>

<style>
  #about {
    width: 100%;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #about > div {
    display: flex;
    gap: 40px 40px;
    justify-content: center;
    flex-wrap: wrap;
    margin: 20px 0;
  }

  .title {
    font-size: clamp(1rem, 7vw, 3rem);
    color: var(--primary);
  }

  .description {
    font-size: clamp(1rem, 2vw, 1.2rem);
    text-align: center;
    line-height: calc(clamp(1rem, 2vw, 1.2rem) * 1.33);
    margin: 20px 50px;
  }

  .github,
  .software,
  .team {
    width: fit-content;
    max-width: 90vw;
    background-color: #323232;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    padding: 10px 0 30px 0;
    z-index: 1;
  }

  .software {
    flex-basis: 100%;
  }

  .github > h3,
  .software > h3,
  .team > h3 {
    font-size: clamp(1.2rem, 5vw, 1.5rem);
    color: var(--secondary);
  }

  .software > ul,
  .team > ul {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    list-style: none;
    gap: 10px;
    padding-bottom: 10px;
  }

  .software > ul {
    flex-wrap: wrap;
    justify-content: center;
    width: fit-content;
    gap: 40px 20px;
  }

  .softwareItem {
    aspect-ratio: 1/1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 150px;
    max-width: 150px;
    transform-style: preserve-3d;
    transition: transform 0.75s ease-in-out;
  }

  .softwareItem:hover {
    transform: rotateX(90deg);
  }

  .softwareItem:hover img {
    border-radius: 0;
  }

  .side {
    aspect-ratio: 1/1;
    position: absolute;
    backface-visibility: hidden;
  }

  .softwareItem img {
    width: calc(100% - 40px);
    padding: 20px;
    background-color: white;
    transform: translateZ(75px);
    border-radius: 15px;
    transition: border-radius 0.3s ease-in-out;
  }

  .softwareItem div {
    width: calc(100% - 10px);
    padding: 5px;
    color: white;
    background-color: var(--secondary);
    transform: rotateX(-90deg) translateZ(75px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .softwareTitle {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
  }

  .softwareText {
    font-size: 0.8rem;
    text-align: center;
  }

  .connection {
    position: absolute;
    top: 50px;
    left: 50px;
    right: 50px;
    height: 10px;
    background-color: var(--secondary);
    z-index: -1;
  }

  .member {
    width: 100%;
  }

  .member > a {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    border-radius: 10px;
    width: 150px;
  }

  .member img {
    aspect-ratio: 1/1;
    width: 100px;
    border: 5px solid var(--secondary);
    border-radius: 50%;
    transition: transform 0.3s ease-in-out;
  }

  .member img:hover {
    transform: scale(1.1);
  }

  .member p {
    font-size: clamp(0.8rem, 2vw, 1rem);
    font-weight: bold;
    text-shadow: 0 0 5px black;
    color: white;
  }

  .github {
    padding: 10px 50px;
  }

  .github > a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    border-radius: 10px;
    text-decoration: none;
  }

  .github img {
    aspect-ratio: 1/1;
    width: 100px;
    border: 5px solid var(--secondary);
    border-radius: 100%;
    transition: transform 0.3s ease-in-out;
    background-color: white;
  }

  .github img:hover {
    transform: scale(1.1);
  }

  .github p {
    font-size: clamp(0.8rem, 2vw, 1rem);
    font-weight: bold;
    text-shadow: 0 0 5px black;
    color: white;
  }
</style>
