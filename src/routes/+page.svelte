<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	type Todo = {
		id: string;
		text: string;
		completed: boolean;
		created_at: string;
	};

	let newTask = '';
	let todos: Todo[] = [];
	let loading = true;

	// Fetch tasks from Supabase
	onMount(async () => {
		const { data, error } = await supabase
			.from('todos')
			.select('*')
			.order('created_at', { ascending: true });
		if (error) {
			console.error('Error fetching todos:', error);
		} else {
			todos = data as Todo[];
		}
		loading = false;
	});

	// Add a new task
	async function addTask() {
		if (!newTask.trim()) return;

		const { data, error } = await supabase
			.from('todos')
			.insert([{ text: newTask, completed: false }])
			.select();

		if (error) {
			console.error('Error adding task:', error);
		} else if (data && data.length > 0) {
			todos = [...todos, data[0]];
			newTask = '';
		}
	}

	// Toggle completion
	async function toggleTask(todo: Todo) {
		const { data, error } = await supabase
			.from('todos')
			.update({ completed: !todo.completed })
			.eq('id', todo.id)
			.select();

		if (error) {
			console.error('Error toggling task:', error);
		} else if (data) {
			todos = todos.map((t) => (t.id === todo.id ? data[0] : t));
		}
	}

	// Delete task
	async function deleteTask(id: string) {
		const { error } = await supabase.from('todos').delete().eq('id', id);
		if (error) {
			console.error('Error deleting task:', error);
		} else {
			todos = todos.filter((t) => t.id !== id);
		}
	}
</script>

<main class="todo-wrapper">
	<h1>📝 Todo List</h1>

	<form on:submit|preventDefault={addTask}>
		<input type="text" bind:value={newTask} placeholder="Add a new task..." />
		<button type="submit">Add</button>
	</form>

	{#if loading}
		<p>Loading tasks...</p>
	{:else if todos.length === 0}
		<p>No tasks yet!</p>
	{:else}
		<ul>
			{#each todos as todo}
				<li>
					<label>
						<input type="checkbox" checked={todo.completed} on:change={() => toggleTask(todo)} />
						<span class:line-through={todo.completed}>{todo.text}</span>
					</label>
					<button on:click={() => deleteTask(todo.id)}>❌</button>
				</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	.todo-wrapper {
		max-width: 400px;
		margin: 10vh auto 0 auto;
		padding: 1rem;
		background: var(--pico-background-color);
		border-radius: 1rem;

		/* Right-side-only drop shadow */
		box-shadow: 8px 0 20px rgba(0, 0, 0, 0.2);
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	form input[type='text'] {
		width: 100%;
	}
  
	form button {
		width: 100%;
		display: inline-block;
		text-align: center;
		margin: 0; /* Reset any weird horizontal alignment */
	}

	ul {
		list-style: none;
		padding-left: 0;
		margin-top: 1rem;
	}

	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid var(--pico-muted-border-color);
	}

	.line-through {
		text-decoration: line-through;
		opacity: 0.6;
	}

	button {
		margin-left: 1rem;
	}
</style>
