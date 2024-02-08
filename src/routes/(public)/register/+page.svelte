<script>
	import { AlertCircle } from 'lucide-svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { fly } from 'svelte/transition';
	import { enhance } from '$app/forms';
	import { Loader2 } from 'lucide-svelte';

	export let data;
	export let form;

	let loading = false;
</script>

<div class="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[320px]">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Sign up</h1>
		<p class="text-sm text-muted-foreground">
			Or <a href="/login" class="underline underline-offset-4 hover:text-primary">log in</a> if you already
			have an account.
		</p>
	</div>
	<form
		class="grid gap-6"
		method="POST"
		action="?/register"
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
				id="firstName"
				placeholder="First Name"
				name="firstName"
				value={form?.firstName}
				type="text"
				autocomplete="given-name"
				required
			/>
			<Input
				id="lastName"
				placeholder="Last Name"
				name="lastName"
				value={form?.lastName}
				type="text"
				autoComplete="family-name"
				required
			/>
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
				autocomplete="new-password"
				required
			/>
			<p class="mt-2 text-sm text-muted-foreground">
				You currently need an invite code to be able to create an account.
			</p>
			<Input
				id="inviteCode"
				placeholder="Invite Code"
				name="inviteCode"
				value={form?.inviteCode}
				type="text"
				autocomplete="off"
				required
			/>
		</div>
		<Button type="submit" disabled={loading}>
			{#if loading}
				<Loader2 class="mr-2 h-4 w-4 animate-spin" />
			{/if}
			Sign up
		</Button>
		{#if form?.error}
			<div transition:fly={{ y: 20 }}>
				<Alert.Root variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<Alert.Title>Sign up failed</Alert.Title>
					<Alert.Description>An error occurred during sign up.</Alert.Description>
				</Alert.Root>
			</div>
		{/if}
	</form>
</div>
