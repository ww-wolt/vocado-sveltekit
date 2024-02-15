<script>
	import HeaderBar from '$lib/components/ui/HeaderBar.svelte';
	import { Input } from '$lib/components/ui/input';
	import fuzzysort from 'fuzzysort';
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
		/>
	</form>
</div>
