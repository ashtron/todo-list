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

<main class="container">
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
