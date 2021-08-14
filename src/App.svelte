<script>
	const timer = {
    isTimeOn: false,
    isTimeOff: false,
    on: localStorage.getItem('timeOn') || '',
    off: localStorage.getItem('timeOff') || '',
};

function startAndStopTimer(timer){
	if(!timer.isTimeOn){

	}
}


</script>

<main>
	    <section>
        <span id='time-on'>0:00</span>
        <button id='btn' class='btn-on'>Start on</button>
        <span id='time-off'>0:00</span>
    </section>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>