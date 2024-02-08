<script>
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { Loader2 } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	export let data;
	export let form;

	let loading = false;
</script>

<div class="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[320px]">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Login</h1>
		<p class="text-sm text-muted-foreground">
			Or <a href="/register" class="underline underline-offset-4 hover:text-primary">sign up</a> if you
			don’t have an account yet.
		</p>
	</div>
	<form
		class="grid gap-6"
		method="POST"
		action="?/login&redirectTo={data.redirectTo || ''}"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<div class="grid gap-2">
			<Input
				id="email"
				placeholder="Email"
				type="email"
				name="email"
				value={form?.email}
				autocapitalize="none"
				autocomplete="email"
				autocorrect="off"
				required
			/>
			<Input
				id="password"
				placeholder="Password"
				name="password"
				type="password"
				autoComplete="current-password"
				required
			/>
		</div>
		<Button type="submit" disabled={loading}>
			{#if loading}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Sign In
		</Button>
		{#if form?.error}
			<div transition:fly={{ y: 20 }}>
				<Alert.Root variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<Alert.Title>Login failed</Alert.Title>
					<Alert.Description>An error occurred during login.</Alert.Description>
				</Alert.Root>
			</div>
		{/if}
	</form>
</div>
