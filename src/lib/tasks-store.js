import { writable } from 'svelte/store';

export let /** @type {Writable<{ id: number, name: string }[]>} */ tasks = writable([]);
export let /** @type {Writeable<{ id: number, name: string }} */ task = writable()