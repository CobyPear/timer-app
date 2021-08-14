<script>
  const timer = {
    isTimeOn: false,
    isTimeOff: false,
    on: 0,
    off: 0,
    timeOn: '',
    timeOff: '',
    interval: () => {},
  };

  let secondsOn = 0,
    minutesOn = 0,
    hoursOn = 0,
    secondsOff = 0,
    minutesOff = 0,
    hoursOff = 0,
    endTimeOn = 0,
    endTimeOff = 0,
    elapsedOn = 0,
    elapsedOff = 0;
  let isTimeOn = false,
    isTimeOff = false;

  const formatTime = unit => {
    if (unit < 10) {
      return `0${unit}`;
    } else {
      return `${unit}`;
    }
  };

  const start = timer => {
    clearInterval(timer.interval);
    localStorage.setItem('timeOn', Date.now());
    timer.isTimeOn = true;
    timer.on = Date.now();
    timer.interval = setInterval(() => {
      console.log(timer);
      endTimeOn = Date.now();
      elapsedOn = Math.floor(endTimeOn - timer.on);
      secondsOn = Math.floor((elapsedOn / 1000) % 60);
      minutesOn = Math.floor((elapsedOn / (1000 * 60)) % 60);
      hoursOn = Math.floor((elapsedOn / (1000 * 60 * 60)) % 24);
      console.log(formatTime(secondsOn));
    }, 1000);
    console.log(timer);
  };
  
  const stop = timer => {
    console.log(timer.interval);
    clearInterval(timer.interval);
    localStorage.setItem('timeOnStop', Date.now());
    timer.isTimeOn = false;
    timer.isTimeOff = true;
    isTimeOn = false;
    timer.off = Date.now();
    setInterval(() => {
      endTimeOff = Date.now();
      elapsedOff = Math.floor(endTimeOff - timer.off);
      secondsOff = Math.floor((elapsedOff / 1000) % 60);
      minutesOff = Math.floor((elapsedOff / (1000 * 60)) % 60);
      hoursOff = Math.floor((elapsedOff / (1000 * 60 * 60)) % 24);
    });
  };

  //   function startAndStopTimer(timer) {
  //     console.log('timer.isTimerOn', timer.isTimeOn);
  //     if (!timer.isTimeOn) {
  // 		console.log('start timer on')
  // 		timer.isTimeOn = true;
  // 		localStorage.setItem('timeOnStart', getNow());
  // 		timer.on = localStorage.getItem('timeOn');
  // 		console.log('timer.on: ', timer.on);
  // 		console.log('local storagae: ', localStorage.getItem('timeOn'));
  // 		timer.func = (function update() {
  // 			timer.timeOn = getTime(parseISO(timer.on));
  // 			console.log(timer.timeOn);
  // 		})();
  //     }
  //     if (!timer.isTimeOff) {
  // 		console.log('start timer off')
  // 		timer.isTimeOff = !timer.isTimeOff;
  // 		localStorage.setItem('timeOnStop', getNow());
  // 		localStorage.setItem('timeOffStart', getNow());
  //     }
  //     if (timer.isTimeOn) {
  // 		console.log('clear timerOn')
  //       timer.isTImeOn = !timer.isTimeOn;
  //       console.log('else');
  //       localStorage.setItem('timeOffStop', getNow());
  //     }

  // 	console.log(timer)
  //   }
</script>

<main>
  <section>
    <span
      >{`${formatTime(hoursOn)}:${formatTime(minutesOn)}:${formatTime(
        secondsOn
      )}`}</span
    >
    <button class="btn-on" on:click={() => start(timer)} id="btn"
      >Start on</button
    >
    {#if isTimeOn && isTimeOff}
      <button class="btn-off" on:click={() => stop(timer)} id="btn"
        >Start off</button
      >
    {:else if timer.isTimeoff}
      <button class="btn-off" on:click={() => stop(timer)} id="btn"
        >Start off</button
      >
    {/if}
    <span
      >{`${formatTime(hoursOff)}:${formatTime(minutesOff)}:${formatTime(
        secondsOff
      )}`}</span
    >
  </section>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  :root {
    --btn-color-on: #861590;
    --btn-color-off: #1ec7be;
  }
  #btn {
    color: #ffffff;
  }
  .btn-on {
    background-color: var(--btn-color-on);
  }
  .btn-off {
    background-color: var(--btn-color-off);
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
