<script>
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	export let data;
</script>

<div class="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[320px]">
	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Sign up</h1>
		<p class="text-sm text-muted-foreground">
			Or <a href="/login" class="underline underline-offset-4 hover:text-primary">log in</a> if you already
			have an account.
		</p>
		
	</div>
	<div class="grid gap-6">
		<div class="grid gap-2">
			<Input
				id="firstName"
				placeholder="First Name"
				name="firstName"
				type="text"
				autocomplete="given-name"
				required
			/>
			<Input
				id="lastName"
				placeholder="Last Name"
				name="lastName"
				type="text"
				autoComplete="family-name"
				required
			/>
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
			<p class="text-sm text-muted-foreground mt-2">You currently need an invite code to be able to create an account. </p>
			<Input
				id="inviteCode"
				placeholder="Invite Code"
				name="inviteCode"
				type="text"
				autoComplete="off"
				required
			/>
		</div>
		<Button>
			<!-- {#if isLoading}
				<Icons.spinner class="mr-2 h-4 w-4 animate-spin" />
			{/if} -->
			Sign In
		</Button>
	</div>
</div>
