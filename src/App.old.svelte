<script>
  const equateSavedTime = (start, end) => {
    let elapsed = end - start;
    console.log(elapsed);
    return elapsed;
  };
  const timer = {
    isTimeOn: false,
    isTimeOff: false,
    on: 0,
    off: 0,
    timeOn: 0,
    timeOff: 0,
    // need to do this. save start time and end time in local storage, then calculate here
    savedTimeOn: equateSavedTime(
      localStorage.getItem('timeOnStart'),
      localStorage.getItem('timeOnStop')
    ),
    savedTimeOff: equateSavedTime(
      localStorage.getItem('timeOffStart'),
      localStorage.getItem('timeOffStop')
    ),
    interval: () => {},
  };
  console.log(timer);

  let elapsedOn = timer.savedTimeOn || 0,
    elapsedOff = timer.savedTimeOff || 0,
    secondsOn = Math.floor((elapsedOn / 1000) % 60) || 0,
    secondsOff = Math.floor((elapsedOff / 1000) % 60) || 0,
    minutesOn = Math.floor((elapsedOn / (1000 * 60)) % 60) || 0,
    minutesOff = Math.floor((elapsedOff / (1000 * 60)) % 60) || 0,
    hoursOn = Math.floor((elapsedOn / (1000 * 60 * 60)) % 24) || 0,
    hoursOff = Math.floor((elapsedOff / (1000 * 60 * 60)) % 24) || 0,
    endTimeOn = 0,
    endTimeOff = 0;

  // let isTimeOn = false,
  //   isTimeOff = false;

  const formatTime = unit => {
    if (unit < 10) {
      return `0${unit}`;
    } else {
      return `${unit}`;
    }
  };
  // const getTime = numOfSeconds => {
  //   let seconds = (numOfSeconds % 60).toFixed(0);
  //   let minutes = seconds / 60;
  //   let hours = minutes * 60 % 24;
  //   console.log(seconds,minutes,hours)
  //   return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
  // };
  // console.log(getTime(12000))
  const start = timer => {
    if (!timer.isTimeOn && !timer.isTimeOff) {
      console.log('start on');
      clearInterval(timer.interval); // clear current timer
      if (timer.on) {
        localStorage.setItem('timeOnStart', Date.now()); // set start time in local storage
      }
      if (!localStorage.getItem('timeOffStop')) {
        localStorage.setItem('timeOffStop', Date.now());
      }
      timer.isTimeOn = true;
      timer.isTimeOff = false;
      // timer.on = timer.on ? timer.on : Date.now();
      timer.interval = setInterval(() => {
        endTimeOn = Date.now();
        elapsedOn = Math.floor(endTimeOn - timer.on);
        secondsOn = Math.floor((elapsedOn / 1000) % 60);
        minutesOn = Math.floor((elapsedOn / (1000 * 60)) % 60);
        hoursOn = Math.floor((elapsedOn / (1000 * 60 * 60)) % 24);
      }, 1000);
      console.log(timer);
    } else if (timer.isTimeOn && !timer.isTimeOff) {
      console.log('stop on, start off');
      console.log(timer.interval);
      clearInterval(timer.interval);
      localStorage.setItem('timeOnStop', Date.now());
      localStorage.setItem('timeOffStart', Date.now());
      timer.isTimeOn = false;
      timer.isTimeOff = true;
      timer.off = timer.off || Date.now();
      timer.interval = setInterval(() => {
        endTimeOff = Date.now();
        elapsedOff = Math.floor(endTimeOff - timer.off);
        secondsOff = Math.floor((elapsedOff / 1000) % 60);
        minutesOff = Math.floor((elapsedOff / (1000 * 60)) % 60);
        hoursOff = Math.floor((elapsedOff / (1000 * 60 * 60)) % 24);
      });
      console.log(timer);
    } else {
      // timer.isTimeOn = false;
      timer.isTimeOff = false;
      clearInterval(timer.interval);
      localStorage.setItem('timeOffStop', Date.now());
    }
  };
</script>

<main>
  <section>
    <span
      >{`${formatTime(hoursOn)}:${formatTime(minutesOn)}:${formatTime(
        secondsOn
      )}`}</span
    >
    <button
      class={!timer.isTimeOn ? 'btn-on' : 'btn-off'}
      on:click={() => {
        console.log(timer.isTimeOn, timer.isTimeOff);
        start(timer);
        console.log(timer.isTimeOn, timer.isTimeOff);
        // !timer.isTimeOn ? start(timer) : stop(timer);
        // if (!timer.isTimeOn) {
        //   console.log('start')
        // } else {
        //   console.log('stop')
        //   stop(timer)
        // }
      }}
      id="btn">{!timer.isTimeOn ? 'Start on' : 'Start off'}</button
    >
    <!-- {#if isTimeOn}
    {console.log(isTimeOn)}
      <button class="btn-off" on:click={() => {
        timer.isTimeOff = true;
        stop(timer)
      }} id="btn"
        >Start off</button
      >
    {:else if timer.isTimeoff}
      <button class="btn-off" on:click={() => stop(timer)} id="btn"
        >Start off</button
      >
    {/if} -->
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
