<script lang="ts">
	import { onMount } from 'svelte';

	let links: Array<{
		slug: string;
		url: string;
		shortUrl: string;
		createdAt: string;
		clickCount: number;
		qrCodeUrl?: string;
	}> = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		await loadLinks();
	});

	async function loadLinks() {
		try {
			loading = true;
			const response = await fetch('http://localhost:3000/api/links');
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch links');
			}

			links = await Promise.all(
				data.map(async (link: any) => ({
					...link,
					qrCodeUrl: await fetchQRCode(link.slug)
				}))
			);
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function fetchQRCode(slug: string): Promise<string | undefined> {
		try {
			const response = await fetch(`http://localhost:3000/api/qrcode/${slug}`);
			if (!response.ok) {
				return undefined;
			}
			const blob = await response.blob();
			return URL.createObjectURL(blob);
		} catch (err) {
			return undefined;
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString();
	}

	function truncateUrl(url: string, maxLength: number = 40) {
		return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
	}
</script>

<div class="container">
	<h1>My Links</h1>

	{#if loading}
		<div class="loading">Loading links...</div>
	{:else if error}
		<div class="error">
			<h2>Error</h2>
			<p>{error}</p>
		</div>
	{:else if links.length === 0}
		<div class="no-links">
			<p>No links found.</p>
		</div>
	{:else}
		<div class="table-container">
			<table>
				<thead>
					<tr>
						<th>Original URL</th>
						<th>Short URL</th>
						<th>Clicks</th>
						<th>Created</th>
						<th>QR Code</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each links as link}
						<tr>
							<td class="url-cell">
								<a href={link.url} target="_blank" rel="noopener noreferrer" title={link.url}>
									{truncateUrl(link.url)}
								</a>
							</td>
							<td class="url-cell">
								<a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
									{link.shortUrl}
								</a>
							</td>
							<td class="click-count">{link.clickCount}</td>
							<td class="date-cell">{formatDate(link.createdAt)}</td>
							<td class="qr-cell">
								{#if link.qrCodeUrl}
									<img 
										src={link.qrCodeUrl} 
										alt="QR Code for {link.shortUrl}"
										width="60"
										height="60"
									/>
								{:else}
									<span class="qr-unavailable">N/A</span>
								{/if}
							</td>
							<td class="actions-cell">
								<a href="/analytics/{link.slug}" class="analytics-link">Analytics</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: system-ui, -apple-system, sans-serif;
	}

	h1 {
		margin: 0 0 2rem 0;
		color: #333;
	}

	.loading {
		text-align: center;
		padding: 2rem;
		color: #666;
		font-size: 1.1rem;
	}

	.error {
		text-align: center;
		padding: 2rem;
		background-color: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 6px;
		color: #721c24;
	}

	.error h2 {
		margin-top: 0;
	}

	.no-links {
		text-align: center;
		padding: 2rem;
		color: #666;
		font-style: italic;
	}

	.table-container {
		overflow-x: auto;
		border: 1px solid #e9ecef;
		border-radius: 6px;
		background-color: white;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background-color: #f8f9fa;
		padding: 1rem 0.75rem;
		text-align: left;
		font-weight: 600;
		color: #555;
		border-bottom: 2px solid #e9ecef;
	}

	td {
		padding: 0.75rem;
		border-bottom: 1px solid #e9ecef;
		vertical-align: middle;
	}

	tr:hover {
		background-color: #f8f9fa;
	}

	tr:last-child td {
		border-bottom: none;
	}

	.url-cell a {
		color: #007bff;
		text-decoration: none;
		word-break: break-all;
	}

	.url-cell a:hover {
		text-decoration: underline;
	}

	.click-count {
		text-align: center;
		font-weight: 600;
		color: #28a745;
	}

	.date-cell {
		white-space: nowrap;
		color: #666;
	}

	.qr-cell {
		text-align: center;
	}

	.qr-cell img {
		border-radius: 4px;
		border: 1px solid #e9ecef;
	}

	.qr-unavailable {
		color: #6c757d;
		font-style: italic;
	}

	.actions-cell {
		text-align: center;
	}

	.analytics-link {
		color: #6c757d;
		text-decoration: none;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border: 1px solid #6c757d;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.analytics-link:hover {
		background-color: #6c757d;
		color: white;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}


		th, td {
			padding: 0.5rem 0.25rem;
			font-size: 0.9rem;
		}

		.qr-cell img {
			width: 40px;
			height: 40px;
		}
	}
</style>