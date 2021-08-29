<script>
  import AddTask from './AddTask.svelte';
  import { tasks } from '../lib/tasks-store';
  import { fix_and_destroy_block } from 'svelte/internal';
</script>

<AddTask />

<ul>
  {#each $tasks as task}
    <li>
      <span>{task.name}</span>
      <button on:click={() => ($tasks = $tasks.filter(t => t.id !== task.id))}
        >Remove</button
      >
    </li>
  {/each}
</ul>

<style>
    li > span {
        margin-right: 1rem;
        color: #ffffff;
    }
</style>