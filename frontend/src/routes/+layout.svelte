<script>
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Navbar />

<main class="main-content">
	<slot />
</main>

<Footer />

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background-color: #ffffff;
		color: #333;
		line-height: 1.6;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.main-content {
		flex: 1;
	}
</style>