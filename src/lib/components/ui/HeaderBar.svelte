<script>
	import LanguageToggle from '$lib/components/ui/LanguageToggle.svelte';

	export let title = '';
</script>

<header
	class="bg-white-200 fixed z-10 mx-auto flex w-full max-w-lg justify-end gap-2 bg-white px-3 py-4"
>
	<!-- <img src={logo} alt="Vocado Logo" class="h-auto w-5" /> -->
	<!-- <h1 class=" text-xl font-semibold tracking-tight">Vocado</h1> -->
	<!-- <div></div> -->
	<!-- <div class="h-full w-full"><h1 class="bg-lime-200 align-middle text-xl font-semibold tracking-tight">Search</h1></div> -->

	<div class="absolute left-0 top-0 flex h-full w-full items-center">
		<div class="w-[4.5rem] sm:w-6"></div>
		<h1 class="text-md h-fit text-center font-medium">
			{title}
		</h1>
	</div>
	<LanguageToggle />
</header>
<!-- <div id="spacer" class="h-16 w-full" /> -->
