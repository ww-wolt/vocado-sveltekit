<script>
	import { Button } from '$lib/components/ui/button';
	const flags = ['fr', 'gb'];
	let flagIndex = 0;
</script>

<Button
	variant="ghost"
	class="box-border px-3"
	on:click={() => {
		flagIndex = (flagIndex + 1) % flags.length;
	}}
>
	<div class="inner-boarder relative overflow-hidden rounded-sm">
		<img src={`/flag-icons/${flags[flagIndex]}.svg`} alt="" class=" h-6 w-auto" />
	</div>
</Button>

<style>
	.inner-boarder {
		/* background-color: aquamarine; */
		/* -webkit-box-shadow: inset 0px 0px 0px 10px #f00;
		-moz-box-shadow: inset 0px 0px 0px 10px #f00;
		box-shadow: inset 0px 0px 0px 10px #f00;
    z-index: 10000; */
	}

	.inner-boarder::before {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		display: block;
		box-sizing: border-box;
		border: 1px solid rgba(0, 0, 0, 0.1);
		/* mix-blend-mode: overlay; */
		z-index: 1;
		/* border-radius: 4px; */
	}
</style>
