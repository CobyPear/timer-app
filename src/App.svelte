<script>
  import Timer from './components/Timer.svelte';
  import TimerHistory from './components/TimerHistory.svelte';
</script>

<main>
  <h1>on off timer</h1>
  <Timer />
  <TimerHistory />
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
</style>
