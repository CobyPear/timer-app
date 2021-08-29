<script>

  import { tasks, task } from '../lib/tasks-store';
  const addTask = newTask => {
    if (newTask === undefined || newTask === '') {
      return;
    }
    const newId = $tasks.length + 1;
    console.log($tasks.length);
    $task = {
      id: newId,
      name: newTask,
    };
    $tasks = [...$tasks, $task];
    console.log($tasks);
    console.log($task)
    $task = ''
  };

  const handleSubmit = () => {};
</script>

<section>
  <h3>Add a task</h3>
  <form on:submit|preventDefault={addTask($task)}>
    <input type="text" bind:value={$task} />
    <button type="submit">Add task</button>
  </form>
</section>
