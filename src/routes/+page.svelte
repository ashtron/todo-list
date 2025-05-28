<script lang="ts">
	let newTask = '';
	let tasks: { text: string; completed: boolean }[] = [];

	function addTask() {
		if (!newTask.trim()) return;
		tasks = [...tasks, { text: newTask, completed: false }];
		newTask = '';
	}

	function toggleTask(index: number) {
		tasks[index].completed = !tasks[index].completed;
		tasks = [...tasks];
	}

	function deleteTask(index: number) {
		tasks.splice(index, 1);
		tasks = [...tasks];
	}
</script>

<main class="container">
	<h1>📝 Todo List</h1>

	<form on:submit|preventDefault={addTask}>
		<input type="text" bind:value={newTask} placeholder="Add a new task..." />
		<button type="submit">Add</button>
	</form>

	<ul>
		{#each tasks as task, i}
			<li>
				<label>
					<input type="checkbox" checked={task.completed} on:change={() => toggleTask(i)} />
					<span class:line-through={task.completed}>{task.text}</span>
				</label>
				<button on:click={() => deleteTask(i)}>❌</button>
			</li>
		{/each}
	</ul>
</main>

<style>
	ul {
		list-style: none;
		padding-left: 0;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.25rem 0;
	}

	.line-through {
		text-decoration: line-through;
		opacity: 0.6;
	}

	button {
		margin-left: 1rem;
	}
</style>
