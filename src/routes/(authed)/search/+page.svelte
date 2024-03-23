<script>
	import HeaderBar from '$lib/components/ui/HeaderBar.svelte';
	import { Input } from '$lib/components/ui/input';

	let query = '';
	let suggestions = [];

	$: fetchSuggestions(query);

	async function fetchSuggestions(query) {
		try {
			const res = await fetch(`/search/suggestions?query=${query}`);

			if (!res.ok) {
				throw new Error('Failed to fetch search suggestions');
			}

			const data = await res.json();
			suggestions = data.suggestions;
		} catch (error) {
			console.error('Error fetching search suggestions:', error);
			return []; // Return empty array in case of error
		}
	}
</script>

<HeaderBar title="Dictionary" />
<div class="h-dvh w-full bg-gray-100 p-6 pt-20">
	<!-- <h1>Search</h1> -->
	<form action="" class="mt-2">
		<Input
			id="search"
			placeholder="Search..."
			name="search"
			autocomplete="off"
			autocorrect="off"
			required
			bind:value={query}
		/>
	</form>
	<div id="results" class="py-4">
		{#each suggestions as suggestion}
			<p>{suggestion.language + ': ' + suggestion.word}</p>
		{/each}
	</div>
</div>
