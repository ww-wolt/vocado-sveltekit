<script>
	import logo from '$lib/assets/vocado-logo.svg';

	export let data;
</script>


<header class="fixed mx-auto flex w-full max-w-lg gap-2 p-6 bg-white">
	<img src={logo} alt="Vocado Logo" class="h-auto w-5" />
	<h1 class=" text-xl font-semibold tracking-tight">Vocado</h1>
</header>
<main class="mt-24 w-full p-6"><slot /></main>
