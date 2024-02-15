<script>
	import logo from '$lib/assets/vocado-logo.svg';
	import Navigation from '$lib/components/ui/Navigation.svelte';

	export let data;
</script>

<header class="fixed mx-auto flex w-full max-w-lg gap-2 bg-white p-6">
	<!-- <Navigation/> -->
	<img src={logo} alt="Vocado Logo" class="h-auto w-5" />
	<h1 class=" text-xl font-semibold tracking-tight">Vocado</h1>
</header>
<main class="mt-24 w-full p-6"><slot /></main>
