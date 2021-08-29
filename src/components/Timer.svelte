<script>
  import {
    timeOn,
    timeOff,
    isTimeOn,
    isTimeOff,
    lastTimeOn,
    lastTimeOff,
  } from '../lib/timer-store';
  import { updateLocalStorage, incrementTime } from '../lib/utils';

  let /** @type setInterval */ timerOn;
  let /** @type setInterval */ timerOff;

  $: secondsOn /** @type number */ = ~~$timeOn % 60;
  $: minutesOn /** @type number */ = ~~(($timeOn % 3600) / 60);
  $: hoursOn /** @type number */ = ~~($timeOn / 3600);

  $: secondsOff /** @type number */ = ~~$timeOff % 60;
  $: minutesOff /** @type number */ = ~~(($timeOff % 3600) / 60);
  $: hoursOff /** @type number */ = ~~($timeOff / 3600);

  /**
   * @param {setInterval} timer timerOn or timerOff timer
   * @param {Writeable<boolean>} timeBool isTimeOn or isTimeOff (maybe needs the $ when passing in?)
   * @description clear the timer and set the store to it's opposite value
   */
  const clearAndSet = (timer, timeBool) => {
    timeBool.update(value => !value);
    clearInterval(timer);
  };

  const startAndStopTimer = () => {
    if (!$isTimeOn) {
      $isTimeOn = !$isTimeOn;
      timerOn = setInterval(() => {
        incrementTime(timeOn);
        updateLocalStorage('timeOn', $timeOn);
      }, 1000);
      if ($isTimeOff) {
        clearAndSet(timerOff, isTimeOff);
      }
    } else if (!$isTimeOff) {
      $isTimeOff = !$isTimeOff;
      timerOff = setInterval(() => {
        incrementTime(timeOff);
        updateLocalStorage('timeOff', $timeOff);
      }, 1000);
      if ($isTimeOn) {
        clearAndSet(timerOn, isTimeOn);
      }
    }
  };

  const clearTimers = () => {
    clearInterval(timerOn);
    clearInterval(timerOff);
    $isTimeOn = false;
    $isTimeOff = false;
    updateLocalStorage('lastTimeOn', $timeOn);
    updateLocalStorage('lastTimeOff', $timeOff);
    updateLocalStorage('timeOn', 0);
    updateLocalStorage('timeOff', 0);
    $lastTimeOn = JSON.parse(localStorage.getItem('lastTimeOn'));
    $lastTimeOff = JSON.parse(localStorage.getItem('lastTimeOff'));
    timeOn.set(0);
    timeOff.set(0);
    // updateLocalStorage('timeOn', $timeOn);
    // updateLocalStorage('timeOff', $timeOff);
  };

  const stopTimers = () => {
    $isTimeOn = false;
    $isTimeOff = false;
    clearInterval(timerOn);
    clearInterval(timerOff);
  };
</script>

<section>
  <button
    class={'start-stop-btn'}
    class:start={$isTimeOff || !$isTimeOn}
    class:stop={$isTimeOn && !$isTimeOff}
    on:click={() => startAndStopTimer()}
    >{$isTimeOn && !$isTimeOff ? 'Start time off' : 'Start time on'}</button
  >
  <figure class="timer">
    <span id="timeOn">time on: </span>{hoursOn >= 10
      ? hoursOn
      : `0${hoursOn}`}:{minutesOn >= 10
      ? minutesOn
      : `0${minutesOn}`}:{secondsOn >= 10 ? secondsOn : `0${secondsOn}`}
  </figure>
  <br />
  <figure class="timer">
    <span id="timeOff">time off: </span>{hoursOff >= 10
      ? hoursOff
      : `0${hoursOff}`}:{minutesOff >= 10
      ? minutesOff
      : `0${minutesOff}`}:{secondsOff >= 10 ? secondsOff : `0${secondsOff}`}
  </figure>

  <figure class='btn-sec'>
    <button class="clear" on:click={() => clearTimers()}>Clear Timers</button>
    <button class="stopTimers" on:click={() => stopTimers()}>Stop Timers</button>
  </figure>
</section>

<style>
  /* 
        #c955e6: purpley
        #09eb7a: tealy
     */
  section {
    display: flex;
    flex-direction: column;
  }
  .timer {
    color: #ffffff;
    margin: 0 auto;
    font-size: 2em;
  }
  #timeOn {
    color: #09eb7a;
  }
  #timeOff {
    color: #00d9ff;
  }
  button {
    width: 10rem;
    margin: 1rem auto 1rem;
  }
  .btn-sec {
      margin: 2rem auto;
  }
  .start-stop-btn {
    justify-content: center;
  }
  .start {
    background-color: #09eb7a;
  }
  .stop {
    background-color: #00d9ff;
  }
  .clear {
    background-color: #f6000054;
    color: #ffffff;
  }
  .stopTimers {
    background-color: #f60000d5;
    color: #ffffff;
  }
</style>
