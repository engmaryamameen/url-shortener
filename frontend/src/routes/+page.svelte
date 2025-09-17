<script lang="ts">
	let url = '';
	let slug = '';
	let shortUrl = '';
	let error = '';
	let loading = false;
	let copied = false;

	async function handleSubmit() {
		if (!url.trim()) {
			error = 'URL is required';
			return;
		}

		loading = true;
		error = '';
		shortUrl = '';

		try {
			const response = await fetch('http://localhost:3000/api/shorten', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					url: url.trim(),
					...(slug.trim() && { slug: slug.trim() })
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to create short URL');
			}

			shortUrl = data.shortUrl;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(shortUrl);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			error = 'Failed to copy to clipboard';
		}
	}
</script>

<div class="container">
	<h1>URL Shortener</h1>
	
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
				pattern="^[A-Za-z0-9-_]{3,64}$"
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

	{#if shortUrl}
		<div class="result">
			<h3>Your Short URL:</h3>
			<div class="short-url-container">
				<input type="text" value={shortUrl} readonly class="short-url" />
				<button type="button" on:click={copyToClipboard} class="copy-btn">
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>
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

	h1 {
		text-align: center;
		color: #333;
		margin-bottom: 2rem;
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

	.result {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: #d4edda;
		border: 1px solid #c3e6cb;
		border-radius: 6px;
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
</style>
