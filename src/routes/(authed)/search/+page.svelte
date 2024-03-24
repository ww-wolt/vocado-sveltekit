<script>
	import HeaderBar from '$lib/components/ui/HeaderBar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Search } from 'lucide-svelte';
	import { Loader2 } from 'lucide-svelte';
	import { X } from 'lucide-svelte';

	import fr from '$lib/assets/flag-icons/fr.svg';
	import en from '$lib/assets/flag-icons/en.svg';
	import de from '$lib/assets/flag-icons/de.svg';
	const flags = { fr, en, de };

	let query = '';
	let suggestions = [];
	let latestFetch = Date.now();

	let searchInput;

	$: fetchSuggestions(query);

	async function fetchSuggestions(query) {
		const timestamp = Date.now();
		if (!query) {
			suggestions = [];
			latestFetch = timestamp;
			return;
		}

		try {
			// const options = { method: 'GET', headers: { 'User-Agent': 'insomnia/8.6.1' } };
			// fetch(
			// 	`https://m.dict.cc/inc/ajax_autosuggest.php?s=${query}&nr=50&lp_id=1&ldir=3&check_typo=1`,
			// 	options
			// )
			// 	.then((response) => response.json())
			// 	.then((response) => console.log(response))
			// 	.catch((err) => console.error(err));

			const res = await fetch(`/search/suggestions?query=${query}`);

			if (!res.ok) {
				throw new Error('Failed to fetch search suggestions');
			}

			const data = await res.json();

			// Make sure it only updates if fetch is the newest one
			if (timestamp > latestFetch) {
				suggestions = data.suggestions;
				latestFetch = timestamp;
			}
		} catch (error) {
			console.error('Error fetching search suggestions:', error);
			return []; // Return empty array in case of error
		}
	}
</script>

<HeaderBar title="Dictionary" />
<div class="h-dvh w-full bg-gray-100 p-6 pt-20">
	<!-- <h1>Search</h1> -->
	<form action="" class="relative mt-2 flex gap-2">
		<Input
			bind:inputElement={searchInput}
			id="search"
			placeholder="Search..."
			name="search"
			autocomplete="off"
			autocorrect="off"
			required
			bind:value={query}
		/>
		{#if query}
			<Button
				on:click={(e) => {
					e.preventDefault();
					query = '';
					searchInput.focus();
				}}
				variant="ghost"
				class="absolute right-0 top-2 mx-2 h-6 p-3"
			>
				<X class="absolute h-5 w-5" />
			</Button>
		{/if}

		<!-- <X class="absolute right-0 top-0 mx-3 h-full w-5 bg-red-200" /> -->
		<!-- <Loader2 class="absolute right-0 top-0 mx-3 h-full w-5 animate-spin" /> -->

		<!-- <Button>
			<Search class=" h-5 w-5 " />
		</Button> -->
	</form>
	<div id="results" class="py-4">
		{#each suggestions as suggestion}
			<p>{suggestion.language + ': ' + suggestion.word}</p>
		{/each}
	</div>
</div>
