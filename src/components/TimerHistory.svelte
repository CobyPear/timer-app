<script>
  import { lastTimeOn, lastTimeOff } from '../lib/timer-store';

  $: secondsOn /** @type number */ = ~~$lastTimeOn % 60;
  $: minutesOn /** @type number */ = ~~(($lastTimeOn % 3600) / 60);
  $: hoursOn /** @type number */ = ~~($lastTimeOn / 3600);

  $: secondsOff /** @type number */ = ~~$lastTimeOff % 60;
  $: minutesOff /** @type number */ = ~~(($lastTimeOff % 3600) / 60);
  $: hoursOff /** @type number */ = ~~($lastTimeOff / 3600);
</script>

<section>
  <h2>history</h2>
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
</section>

<style>
  h2 {
    color: #ffffff;
    justify-content: center;
    margin: 0 auto;
  }
  section {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
  }
  .timer {
    color: #ffffff;
    font-size: 2em;
    margin: 0 auto;
  }
  #timeOn {
    color: #09eb7a;
  }
  #timeOff {
    color: #00d9ff;
  }
</style>
