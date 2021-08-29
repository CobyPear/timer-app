<script>
  import { prevent_default } from 'svelte/internal';

  import { writable } from 'svelte/store';
  let /** @type localStorage | number*/ storedTimeOn =
      JSON.parse(localStorage.getItem('timeOn')) || 0;
  let /** @type localStorage | number*/ storedTimeOff =
      JSON.parse(localStorage.getItem('timeOff')) || 0;
  // time spent on
  let /** @type Writable<number> */ timeOn = writable(storedTimeOn);
  // time spent off
  let /** @type Writable<number> */ timeOff = writable(storedTimeOff);
  // timer state
  let /** @type Writable<boolean> */ isTimeOn = writable(false);
  let /** @type Writable<boolean> */ isTimeOff = writable(false);
  // elapsed
  let /** @type Writable<number> */ elapsed = writable(0);

  let /** @type setInterval */ timerOn;
  let /** @type setInterval */ timerOff;
  $: secondsOn /** @type number */ = ~~$timeOn % 60;
  $: minutesOn /** @type number */ = ~~(($timeOn % 3600) / 60);
  $: hoursOn /** @type number */ = ~~($timeOn / 3600);

  $: secondsOff /** @type number */ = ~~$timeOff % 60;
  $: minutesOff /** @type number */ = ~~(($timeOff % 3600) / 60);
  $: hoursOff /** @type number */ = ~~($timeOff / 3600);

  /**
   * @param {string} item name of a key in localStorage
   * @param {number} value the value in which to set the item
   * @return void
   * @description at this time i am only concerned with setting numbers to local storage
   */
  const updateLocalStorage = (item, value) => {
    localStorage.setItem(item, value);
  };

  const /** @return void*/ incrementTimeOn = () => {
      timeOn.update(time => time + 1);
      updateLocalStorage('timeOn', $timeOn);
    };
  const /* @return void*/ incrementTimeOff = () => {
      timeOff.update(time => time + 1);
      updateLocalStorage('timeOff', $timeOff);
    };

  const startAndStopTimer = () => {
    if (!$isTimeOn) {
      console.log('start timerOn');
      $isTimeOn = !$isTimeOn;
      console.log($isTimeOn);
      timerOn = setInterval(incrementTimeOn, 1000);
      if ($isTimeOff) {
        updateLocalStorage('timeOff', $timeOff);
        console.log('clear timerOff');
        $isTimeOff = !$isTimeOff;
        clearInterval(timerOff);
      }
    } else if (!$isTimeOff) {
      console.log('start timerOff');
      $isTimeOff = !$isTimeOff;
      console.log($isTimeOn);
      timerOff = setInterval(incrementTimeOff, 1000);

      if ($isTimeOn) {
        updateLocalStorage('timeOn', $timeOn);
        console.log('clear timerOn');
        $isTimeOn = !$isTimeOn;
        clearInterval(timerOn);
      }
    }
  };

  const clearTimers = () => {
    console.log('stop timer');
    console.log($isTimeOn, $isTimeOff);
    clearInterval(timerOn);
    clearInterval(timerOff);
    $isTimeOn = false;
    $isTimeOff = false;
    updateLocalStorage('lastTimeOn', $timeOn);
    updateLocalStorage('lastTimeOff', $timeOff);
    $timeOn = 0;
    $timeOff = 0;
    updateLocalStorage('timeOn', $timeOn);
    updateLocalStorage('timeOff', $timeOff);
  };
</script>

<main>
  <h1>on off timer</h1>
  <button
    class={'start-stop-btn'}
    class:start={$isTimeOff || !$isTimeOn}
    class:stop={$isTimeOn && !$isTimeOff}
    on:click={() => startAndStopTimer()}
    >{$isTimeOn && !$isTimeOff ? 'Start time off' : 'Start time on'}</button
  >

  <span class='timer'>
    <span id='timeOn'>time on: </span>{hoursOn >= 10 ? hoursOn : `0${hoursOn}`}:{minutesOn >= 10
      ? minutesOn
      : `0${minutesOn}`}:{secondsOn >= 10 ? secondsOn : `0${secondsOn}`}
  </span>
  <br />
  <span class='timer'>
    <span id='timeOff'>time off: </span>{hoursOff >= 10 ? hoursOff : `0${hoursOff}`}:{minutesOff >= 10
      ? minutesOff
      : `0${minutesOff}`}:{secondsOff >= 10 ? secondsOff : `0${secondsOff}`}
  </span>

  <button class="clear" on:click={() => clearTimers()}>Clear Timers</button>
</main>

<style>
    /* 
        #c955e6: purpley
        #09eb7a: tealy
     */
  main {
    display: flex;
    flex-direction: column;
  }
  h1 {
    color: #ffffff;
    margin: 0 auto;
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
      color: #c955e6;
  }
  button {
    width: 10rem;
    margin: 1rem auto 1rem;
  }
  .start-stop-btn {
    justify-content: center;
  }
  .start {
    background-color: #09eb7a
  }
  .stop {
    background-color: #c955e6;
  }
  .clear {
    background-color: red;
    color: #ffffff;
  }
</style>
