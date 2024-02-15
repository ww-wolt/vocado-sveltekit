<script>
	import { Menu } from 'lucide-svelte';
	import { X } from 'lucide-svelte';
	import { Search } from 'lucide-svelte';
	import { Library } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { LogOut } from 'lucide-svelte';
	import { page } from '$app/stores';

	export let data;

	let navOpen = false;

	function getButtonVariant(href, currentPath) {
		return currentPath === href ? 'secondary' : 'ghost';
	}

	function closeNav() {
		navOpen = false;
	}
</script>

<nav class="flex">
	<input
		type="checkbox"
		id="drawer-toggle"
		class="peer sr-only relative opacity-0"
		bind:checked={navOpen}
	/>
	<label for="drawer-toggle" class="fixed left-0 top-0 z-30 m-4 rounded-lg p-1 peer-checked:hidden">
		<Menu class="h-8 w-8 " />
	</label>
	<label
		for="drawer-toggle"
		class="fixed left-0 top-0 z-30 m-4 hidden rounded-lg p-1 peer-checked:block"
	>
		<X class="h-8 w-8 " />
	</label>

	<div
		id="background-overlay-dark"
		class="pointer-events-none fixed left-0 top-0 z-20 h-full w-full bg-black opacity-0 transition-all duration-500 peer-checked:pointer-events-auto peer-checked:opacity-50"
	></div>
	<div
		class="fixed left-0 top-0 z-20 h-full w-3/4 max-w-96 -translate-x-full transform bg-white shadow-lg transition-all duration-500 peer-checked:translate-x-0"
	>
		<div class=" h-full pb-8 pl-6 pr-6 pt-24">
			<div id="drawer-content" class="flex h-full flex-col gap-2">
				<Button
					on:click={closeNav}
					href="/search"
					variant={getButtonVariant('/search', $page.url.pathname)}
					class="text-md w-full justify-start align-bottom"
				>
					<Search class="mr-3 h-5 w-5 " />

					Dictionary
				</Button>
				<Button
					on:click={closeNav}
					href="/learn"
					variant={getButtonVariant('/learn', $page.url.pathname)}
					class="text-md w-full justify-start align-bottom"
				>
					<Library class="mr-3 h-5 w-5 " />

					Learn
				</Button>
				<div class="mt-auto">
					<h2 class="text-md px-4 font-medium">Jonas Wolter</h2>
					<p class="mb-2 px-4 text-sm text-muted-foreground">jonas.wolter.ch@gmail.com</p>
				</div>

				<!-- <h2 class="mt-auto">Jonas Wolter</h2> -->
				<Button
					on:click={closeNav}
					href="/logout"
					variant="ghost"
					class="text-md w-full justify-start align-bottom"
				>
					<LogOut class="mr-3 h-5 w-5 " />

					Log out
				</Button>
				<!-- <Button variant="ghost" class="w-full justify-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-2 h-4 w-4"
						>
							<rect width="7" height="7" x="3" y="3" rx="1" />
							<rect width="7" height="7" x="14" y="3" rx="1" />
							<rect width="7" height="7" x="14" y="14" rx="1" />
							<rect width="7" height="7" x="3" y="14" rx="1" />
						</svg>
						Browse
					</Button>
					<Button variant="ghost" class="w-full justify-start">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="mr-2 h-4 w-4"
						>
							<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
							<path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
							<circle cx="12" cy="12" r="2" />
							<path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
							<path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
						</svg>
						Radio
					</Button> -->

				<!-- <h2 class=" justify-self-start text-lg font-semibold">Drawer</h2>
				<p class="mt-auto text-gray-500">This is a drawer.</p>
        <p class="text-gray-500">This is a drawer.</p> -->
			</div>

			<!-- <div class="bg-lime-200 w-full h-full"></div> -->
		</div>
	</div>
</nav>
