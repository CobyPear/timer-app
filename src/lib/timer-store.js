import { writable } from 'svelte/store';

// variables as store, check time spent on and off 
// and if timer on or off is started or stopped.
let /** @type {number} */ storedTimeOn =
    JSON.parse(localStorage.getItem('timeOn')) || 0;
let /** @type {number} */ storedTimeOff =
    JSON.parse(localStorage.getItem('timeOff')) || 0;
let
/** @type {number} */ storedLastTimeOn = JSON.parse(localStorage.getItem('lastTimeOn')) || 0;
let
/** @type {number} */ storedLastTimeOff = JSON.parse(localStorage.getItem('lastTimeOff')) || 0;
export let /** @type {Writable<number>} */ lastTimeOn = writable(storedLastTimeOn);
export let /** @type {Writable<number>} */ lastTimeOff = writable(storedLastTimeOff);
export let /** @type {Writable<number>} */ timeOn = writable(storedTimeOn);
export let /** @type {Writable<number>} */ timeOff = writable(storedTimeOff);
export let /** @type {Writable<boolean>} */ isTimeOn = writable(false);
export let /** @type {Writable<boolean>} */ isTimeOff = writable(false);

// TODO: also save timer start/stop state to localStorage and calculate
// time even when user is currently on the page in the browser.

// export let /** @type Writable<number> */ elapsed = writable(0);