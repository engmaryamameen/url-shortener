<script lang="ts">
	import { onMount } from 'svelte';

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

	let url = '';
	let slug = '';
	let shortUrl = '';
	let shortSlug = '';
	let error = '';
	let loading = false;
	let copied = false;
	let results: Array<{shortUrl: string, slug: string, qrCodeUrl?: string}> = [];

	async function handleSubmit() {
		if (!url.trim()) {
			error = 'URL is required';
			return;
		}

		loading = true;
		error = '';
		shortUrl = '';
		shortSlug = '';

		try {
			const response = await fetch(`${BACKEND_URL}/api/shorten`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					url: url.trim(),
					...(slug.trim() ? { slug: slug.trim() } : {})
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create short URL');
			}

			shortUrl = data.shortUrl;
			shortSlug = data.slug;
			
			const qrCodeUrl = await fetchQRCode(data.slug);
			results = [...results, { shortUrl: data.shortUrl, slug: data.slug, qrCodeUrl }];
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function fetchQRCode(slug: string): Promise<string | undefined> {
		try {
			const response = await fetch(`${BACKEND_URL}/api/qrcode/${slug}`);
			if (!response.ok) {
				console.error('Failed to fetch QR code:', response.status);
				return undefined;
			}
			const blob = await response.blob();
			return URL.createObjectURL(blob);
		} catch (err) {
			console.error('QR code fetch error:', err);
			return undefined;
		}
	}

	async function copyToClipboard(url: string) {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			error = 'Failed to copy to clipboard';
		}
	}

	function formatSlugDisplay(slug: string) {
		return slug
			.replace(/_/g, ' ')
			.replace(/-/g, ' ')
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
</script>

<div class="container">
	<div class="header">
		<h2>Create Short URL</h2>
		<p class="subtitle">Transform long URLs into short, shareable links</p>
	</div>
	
	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="url">Long URL</label>
			<input
				id="url"
				type="url"
				bind:value={url}
				placeholder="https://example.com/very-long-url"
				required
				disabled={loading}
			/>
		</div>

		<div class="form-group">
			<label for="slug">Custom Slug (optional)</label>
			<input
				id="slug"
				type="text"
				bind:value={slug}
				placeholder="my-custom-slug"
				title="3-64 characters, letters, numbers, hyphens, underscores only"
				disabled={loading}
			/>
		</div>

		<button type="submit" disabled={loading || !url.trim()}>
			{loading ? 'Creating...' : 'Create Short URL'}
		</button>
	</form>

	{#if error}
		<div class="error">
			{error}
		</div>
	{/if}

	{#if results.length > 0}
		<div class="results">
			<h2>Your Short URLs</h2>
			{#each results as result, index}
				<div class="result">
					<h3>{formatSlugDisplay(result.slug)}</h3>
					<div class="short-url-container">
						<input type="text" value={result.shortUrl} readonly class="short-url" />
						<button type="button" on:click={() => copyToClipboard(result.shortUrl)} class="copy-btn">
							{copied ? 'Copied!' : 'Copy'}
						</button>
					</div>
					<div class="qr-section">
						<div class="qr-code">
							{#if result.qrCodeUrl}
								<img 
									src={result.qrCodeUrl} 
									alt="QR Code for {result.shortUrl}"
									width="200"
									height="200"
								/>
							{:else}
								<div class="qr-placeholder">
									<span>QR Code unavailable</span>
								</div>
							{/if}
						</div>
						<div class="actions">
							<a href="/analytics/{result.slug}" class="analytics-btn">View Analytics</a>
							<a href="/links" class="links-btn">View All Links</a>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, sans-serif;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		color: #333;
		margin-bottom: 0.5rem;
		font-size: 2.5rem;
		font-weight: 700;
	}

	.subtitle {
		color: #666;
		font-size: 1.1rem;
		margin: 0;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #555;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #007bff;
	}

	input:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}

	button {
		width: 100%;
		padding: 0.75rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover:not(:disabled) {
		background-color: #0056b3;
	}

	button:disabled {
		background-color: #6c757d;
		cursor: not-allowed;
	}

	.error {
		margin-top: 1rem;
		padding: 0.75rem;
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
		border-radius: 6px;
	}

	.results {
		margin-top: 3rem;
	}

	.results h2 {
		color: #333;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.result {
		padding: 1.5rem;
		background-color: #d4edda;
		border: 1px solid #c3e6cb;
		border-radius: 6px;
		margin-bottom: 1.5rem;
	}

	.result h3 {
		margin: 0 0 1rem 0;
		color: #155724;
	}

	.short-url-container {
		display: flex;
		gap: 0.5rem;
	}

	.short-url {
		flex: 1;
		background-color: white;
		border: 1px solid #c3e6cb;
	}

	.copy-btn {
		width: auto;
		padding: 0.75rem 1.5rem;
		background-color: #28a745;
		white-space: nowrap;
	}

	.copy-btn:hover:not(:disabled) {
		background-color: #1e7e34;
	}

	.qr-section {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.qr-code {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		background-color: white;
		border-radius: 8px;
		border: 1px solid #c3e6cb;
	}

	.qr-code img {
		display: block;
		border-radius: 4px;
	}

	.qr-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 200px;
		height: 200px;
		background-color: #f8f9fa;
		border: 2px dashed #dee2e6;
		border-radius: 4px;
		color: #6c757d;
		font-size: 0.9rem;
		text-align: center;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.analytics-btn, .links-btn {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		color: white;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.analytics-btn {
		background-color: #6c757d;
	}

	.analytics-btn:hover {
		background-color: #5a6268;
	}

	.links-btn {
		background-color: #007bff;
	}

	.links-btn:hover {
		background-color: #0056b3;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		h1 {
			font-size: 2rem;
		}

		.actions {
			flex-direction: column;
			align-items: center;
		}

		.analytics-btn, .links-btn {
			width: 100%;
			text-align: center;
		}

		.qr-section {
			gap: 0.75rem;
		}

		.qr-code img {
			width: 150px;
			height: 150px;
		}

		.qr-placeholder {
			width: 150px;
			height: 150px;
		}
	}
</style>