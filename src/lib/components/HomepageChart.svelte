<script lang="ts">
  import type { ChartProps } from '$lib/types';
  import SimpleChart from './SimpleChart.svelte';

  export let charts: ChartProps[];

  const DURATION = 0.75; // s
  const DURATION_MOBILE = 0.5; // s

  let isAnimating = false;
  function onChartClick(index: number) {
    if (index === 1 || isAnimating) return;
    isAnimating = true;
    const isMobile = window.innerWidth < 1700;
    const timeout = isMobile ? DURATION_MOBILE * 1000 : DURATION * 1000;

    // Animate the charts
    isMobile ? animateMobileCharts(index) : animateCharts(index);

    setTimeout(() => {
      // Clear the animation classes
      isMobile ? clearAnimationClassesMobile(index) : clearAnimationClasses(index);

      // Update the charts array
      if (index === 2) {
        const first = charts.shift();
        if (first) charts.push(first);
      } else if (index === 0) {
        const last = charts.pop();
        if (last) charts.unshift(last);
      }
      charts = charts;
      isAnimating = false;
    }, timeout);
  }

  function animateCharts(index: number) {
    const chart0 = document.getElementById('chart0');
    const chart1 = document.getElementById('chart1');
    const chart2 = document.getElementById('chart2');
    const chart3 = document.getElementById('chart3');
    const chartLast = document.getElementById(`chart${charts.length - 1}`);

    if (index === 2) {
      chart0?.classList.add('leftToVoid');
      chart1?.classList.add('middleToLeft');
      chart2?.classList.add('rightToMiddle');
      chart3?.classList.add('voidToRight');
      if (chart3) chart3.style.display = 'inline';
    } else if (index === 0) {
      chartLast?.classList.add('voidToLeft');
      chart0?.classList.add('leftToMiddle');
      chart1?.classList.add('middleToRight');
      chart2?.classList.add('rightToVoid');
      if (chartLast) chartLast.style.display = 'inline';
    }
  }

  function animateMobileCharts(index: number) {
    const chart0 = document.getElementById('chart0');
    const chart1 = document.getElementById('chart1');
    const chart2 = document.getElementById('chart2');

    if (index === 2) {
      chart1?.classList.add('middleToLeftMobile');
      chart2?.classList.add('rightToMiddleMobile');
    } else if (index === 0) {
      chart0?.classList.add('leftToMiddleMobile');
      chart1?.classList.add('middleToRightMobile');
    }
  }

  function clearAnimationClasses(index: number) {
    const chart0 = document.getElementById('chart0');
    const chart1 = document.getElementById('chart1');
    const chart2 = document.getElementById('chart2');
    const chart3 = document.getElementById('chart3');
    const chartLast = document.getElementById(`chart${charts.length - 1}`);

    if (index === 2) {
      chart0?.classList.remove('leftToVoid');
      chart1?.classList.remove('middleToLeft');
      chart2?.classList.remove('rightToMiddle');
      chart3?.classList.remove('voidToRight');
      if (chart3) chart3.style.display = 'none';
    } else if (index === 0) {
      chartLast?.classList.remove('voidToLeft');
      chart0?.classList.remove('leftToMiddle');
      chart1?.classList.remove('middleToRight');
      chart2?.classList.remove('rightToVoid');
      if (chartLast) chartLast.style.display = 'none';
    }
  }

  function clearAnimationClassesMobile(index: number) {
    const chart0 = document.getElementById('chart0');
    const chart1 = document.getElementById('chart1');
    const chart2 = document.getElementById('chart2');

    if (index === 2) {
      chart1?.classList.remove('middleToLeftMobile');
      chart2?.classList.remove('rightToMiddleMobile');
    } else if (index === 0) {
      chart0?.classList.remove('leftToMiddleMobile');
      chart1?.classList.remove('middleToRightMobile');
    }
  }
</script>

<div id="charts">
  <h2 class="title">AI trading history</h2>

  <div class="charts">
    {#each charts as chart, index}
      <button on:click={() => onChartClick(index)} id="chart{index}" class="chart" aria-label="Chart button {index + 1}">
        <SimpleChart chartProps={chart} />
      </button>
    {/each}
    <div class="mobile_buttons">
      <button on:click={() => onChartClick(0)} class="mobile_left" aria-label="Mobile button left">
        <img src="/images/svg/arrow-mobile.svg" alt="left" />
      </button>
      <button on:click={() => onChartClick(2)} class="mobile_right" aria-label="Mobile button right">
        <img src="/images/svg/arrow-mobile.svg" alt="right" />
      </button>
    </div>
  </div>
  <p class="info">Larger dots indicate a stronger buy/sell action</p>
</div>

<style>
  #charts {
    padding: 75px 0;
    width: 100%;
    /* From https://css-generators.com/wavy-shapes/ */
    --mask: radial-gradient(111.8px at 50% 150px, #000 99%, #0000 101%) calc(50% - 100px) 0/200px 51% repeat-x,
      radial-gradient(111.8px at 50% -100px, #0000 99%, #000 101%) 50% 50px/200px calc(51% - 50px) repeat-x,
      radial-gradient(111.8px at 50% calc(100% - 150px), #000 99%, #0000 101%) calc(50% - 100px) 100%/200px 51% repeat-x,
      radial-gradient(111.8px at 50% calc(100% + 100px), #0000 99%, #000 101%) 50% calc(100% - 50px) / 200px calc(51% - 50px) repeat-x;
    -webkit-mask: var(--mask);
    mask: var(--mask);
    background-image: linear-gradient(to bottom, var(--secondary-dark), var(--secondary-light));
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow-x: hidden;
  }

  .title {
    font-size: clamp(1rem, 7vw, 3rem);
    color: var(--primary);
    background-color: white;
    padding: 75px 50px 20px 50px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    transform: translateY(-75px);
    text-align: center;
  }

  .charts {
    position: relative;
    gap: 30px;
    height: 500px;
    width: calc(100% - 60px);
    transform: translateY(-30px);
  }

  .info {
    font-size: clamp(1rem, 4vw, 1.5rem);
    font-weight: 600;
    transform: translateY(-30px);
    text-align: center;
  }

  .chart {
    position: absolute;
    width: 700px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-shadow: 5px 5px 50px 0px #161616cc;
    border-radius: 20px;
    padding: 15px;
    display: none;
    top: 50%;
    left: 50%;
  }

  .mobile_buttons {
    display: none;
    position: absolute;
    align-items: center;
    justify-content: center;
    bottom: 0;
    left: 0;
    gap: 10px;
    width: calc(100% - 20px);
    padding: 0 10px;
    transform: translate(0, 50%);
    z-index: 3;
  }

  .mobile_left,
  .mobile_right {
    position: relative;
    height: 60px;
    max-width: 345px;
    flex-grow: 1;
    flex-basis: 0;
    border-radius: 10px;
    background-color: white;
    box-shadow: 5px 5px 30px 0px #161616cc;
  }

  .mobile_left:hover,
  .mobile_right:hover {
    background-color: var(--primary);
  }

  .mobile_left > img,
  .mobile_right > img {
    width: 100%;
    height: 100%;
    transform: scale(1.2);
    filter: invert(30%) sepia(45%) saturate(4102%) hue-rotate(351deg) brightness(95%) contrast(82%); /* primary color */
  }
  .mobile_right > img {
    transform: scale(1.2) rotate(180deg);
  }

  .mobile_left:hover > img,
  .mobile_right:hover > img {
    filter: invert(1);
  }

  #chart0 {
    display: inline;
    transform: translate(-50%, -50%) translateX(-700px) perspective(50em) rotateY(-45deg) scale(0.74) translateX(75px);
    z-index: 1;
  }

  #chart1 {
    display: inline;
    transform: translate(-50%, -50%);
    z-index: 2;
    cursor: auto;
  }

  #chart2 {
    display: inline;
    transform: translate(-50%, -50%) translateX(700px) perspective(50em) rotateY(45deg) scale(0.74) translateX(-75px);
    z-index: 1;
  }

  #chart0::after,
  #chart2::after,
  :global(.voidToLeft::after),
  :global(.voidToRight::after),
  :global(.middleToLeft::after),
  :global(.middleToRight::after) {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    opacity: 0.5;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-image: url('/images/svg/arrow.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  #chart2::after,
  :global(.voidToRight::after),
  :global(.middleToRight::after) {
    transform: translate(-50%, -50%) rotateY(180deg) !important;
  }

  :global(.middleToLeft::after),
  :global(.middleToRight::after) {
    animation: arrowFadeIn 0.5s ease-in 0s 1 normal forwards;
  }

  :global(.leftToVoid) {
    animation: 0.75s ease-in-out 0s 1 normal forwards running leftToVoid;
  }

  :global(.middleToLeft) {
    animation: 0.75s ease-in-out 0s 1 normal forwards running middleToLeft;
  }

  :global(.rightToMiddle) {
    animation: 0.75s ease-in-out 0s 1 normal forwards running rightToMiddle;
  }

  :global(.rightToMiddle::after) {
    transition: opacity 0.5s ease-in-out;
    opacity: 0 !important;
  }

  :global(.voidToRight) {
    animation: 0.75s ease-in-out 0s 1 normal forwards running voidToRight;
  }

  :global(.voidToLeft) {
    animation: 0.75s ease-in-out 0s 1 reverse forwards running leftToVoid;
  }

  :global(.leftToMiddle) {
    animation: 0.75s ease-in-out 0s 1 reverse forwards running middleToLeft;
  }

  :global(.leftToMiddle::after) {
    transition: opacity 0.5s ease-in-out;
    opacity: 0 !important;
  }

  :global(.middleToRight) {
    animation: 0.75s ease-in-out 0s 1 reverse forwards running rightToMiddle;
  }

  :global(.rightToVoid) {
    animation: 0.75s ease-in-out 0s 1 reverse forwards running voidToRight;
  }

  :global(.middleToLeftMobile) {
    animation: 0.5s ease-in-out 0s 1 normal forwards running middleToLeftMobile;
  }

  :global(.rightToMiddleMobile) {
    display: inline !important;
    animation: 0.5s ease-in-out 0s 1 normal forwards running rightToMiddleMobile;
  }

  :global(.leftToMiddleMobile) {
    display: inline !important;
    animation: 0.5s ease-in-out 0s 1 normal forwards running leftToMiddleMobile;
  }

  :global(.middleToRightMobile) {
    animation: 0.5s ease-in-out 0s 1 reverse forwards running rightToMiddleMobile;
  }

  @keyframes rightToMiddleMobile {
    from {
      transform: translate(-50%, -50%) translateX(700px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }

  @keyframes leftToMiddleMobile {
    from {
      transform: translate(-50%, -50%) translateX(-700px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
  }

  @keyframes middleToRightMobile {
    from {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) translateX(700px);
      opacity: 0;
    }
  }

  @keyframes middleToLeftMobile {
    from {
      transform: translate(-50%, -50%);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) translateX(-700px);
      opacity: 0;
    }
  }

  @keyframes arrowFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.5;
    }
  }

  @keyframes leftToVoid {
    from {
      transform: translate(-50%, -50%) translateX(-700px) perspective(50em) rotateY(-45deg) scale(0.74) translateX(75px);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) translateX(-800px) perspective(50em) rotateY(-90deg) scale(0.74) translateX(75px);
      opacity: 0;
    }
  }

  @keyframes middleToLeft {
    from {
      transform: translate(-50%, -50%);
    }
    to {
      transform: translate(-50%, -50%) translateX(-700px) perspective(50em) rotateY(-45deg) scale(0.74) translateX(75px);
    }
  }

  @keyframes rightToMiddle {
    from {
      transform: translate(-50%, -50%) translateX(700px) perspective(50em) rotateY(45deg) scale(0.74) translateX(-75px);
    }
    to {
      transform: translate(-50%, -50%);
    }
  }

  @keyframes voidToRight {
    from {
      transform: translate(-50%, -50%) translateX(800px) perspective(50em) rotateY(90deg) scale(0.74) translateX(-75px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) translateX(700px) perspective(50em) rotateY(45deg) scale(0.74) translateX(-75px);
      opacity: 1;
    }
  }

  @media (hover: none) {
    .mobile_left:hover,
    .mobile_right:hover {
      background-color: white;
    }
    .mobile_left:hover > img,
    .mobile_right:hover > img {
      filter: invert(30%) sepia(45%) saturate(4102%) hue-rotate(351deg) brightness(95%) contrast(82%) !important; /* primary color */
    }
  }

  @media (max-width: 1700px) {
    #chart0,
    #chart2 {
      display: none;
    }

    .chart {
      width: min(calc(100vw - 20px), 700px);
    }

    .mobile_buttons {
      display: flex;
    }

    .charts {
      height: 520px;
      transform: translateY(-50px);
    }

    #chart0::after,
    #chart2::after {
      content: none;
    }

    .info {
      transform: translateY(0px);
      margin-bottom: 10px;
    }
  }
</style>
