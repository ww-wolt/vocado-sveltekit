<script>
	import { Input } from '$lib/components/ui/input';
	import { Label } from "$lib/components/ui/label";
	import { Button } from "$lib/components/ui/button";
	export let data;
</script>

<div class="mx-auto flex w-full flex-col justify-center space-y-6 h-full sm:w-[320px]">
	<div class="flex flex-col text-center space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">Login</h1>
		<p class="text-sm text-muted-foreground">
			Or <a href="/register" class="underline underline-offset-4 hover:text-primary">sign up</a> if you
			don’t have an account yet.
		</p>
	</div>
	<div class="grid gap-6">
		<div class="grid gap-2">
			<Input
				id="email"
				placeholder="Email"
				type="email"
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
				autoComplete="new-password"
				required
			/>
		</div>
		<Button >
			<!-- {#if isLoading}
				<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
			{/if} -->
			Sign In
		</Button>
	</div>
</div>
