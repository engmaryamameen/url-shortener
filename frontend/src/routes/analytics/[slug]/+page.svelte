<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let analytics: any = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		const slug = $page.params.slug;
		
		try {
			const response = await fetch(`http://localhost:3000/api/analytics/${slug}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch analytics');
			}

			analytics = data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	});

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleString();
	}

	function truncateText(text: string | null, maxLength: number = 50) {
		if (!text) return 'N/A';
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
	}
</script>

<div class="container">
	<h1>Analytics</h1>

	{#if loading}
		<div class="loading">Loading analytics...</div>
	{:else if error}
		<div class="error">
			<h2>Error</h2>
			<p>{error}</p>
		</div>
	{:else if analytics}
		<div class="analytics">
			<div class="summary">
				<h2>Link Summary</h2>
				<div class="summary-item">
					<strong>Original URL:</strong>
					<a href={analytics.url} target="_blank" rel="noopener noreferrer">
						{analytics.url}
					</a>
				</div>
				<div class="summary-item">
					<strong>Total Clicks:</strong>
					<span class="click-count">{analytics.totalClicks}</span>
				</div>
			</div>

			<div class="recent-clicks">
				<h2>Recent Clicks</h2>
				{#if analytics.recentClicks.length === 0}
					<p class="no-clicks">No clicks recorded yet.</p>
				{:else}
					<div class="table-container">
						<table>
							<thead>
								<tr>
									<th>Date</th>
									<th>IP Address</th>
									<th>User Agent</th>
									<th>Referer</th>
								</tr>
							</thead>
							<tbody>
								{#each analytics.recentClicks as click}
									<tr>
										<td>{formatDate(click.createdAt)}</td>
										<td>{click.ip || 'N/A'}</td>
										<td title={click.userAgent || 'N/A'}>
											{truncateText(click.userAgent)}
										</td>
										<td title={click.referer || 'N/A'}>
											{truncateText(click.referer)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
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

	.analytics {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.summary {
		background-color: #f8f9fa;
		padding: 1.5rem;
		border-radius: 6px;
		border: 1px solid #e9ecef;
	}

	.summary h2 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.summary-item {
		margin-bottom: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.summary-item strong {
		color: #555;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.summary-item a {
		color: #007bff;
		text-decoration: none;
		word-break: break-all;
	}

	.summary-item a:hover {
		text-decoration: underline;
	}

	.click-count {
		font-size: 1.5rem;
		font-weight: bold;
		color: #28a745;
	}

	.recent-clicks h2 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.no-clicks {
		text-align: center;
		color: #666;
		font-style: italic;
		padding: 2rem;
		background-color: #f8f9fa;
		border-radius: 6px;
	}

	.table-container {
		overflow-x: auto;
		border: 1px solid #e9ecef;
		border-radius: 6px;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		background-color: white;
	}

	th {
		background-color: #f8f9fa;
		padding: 0.75rem;
		text-align: left;
		font-weight: 600;
		color: #555;
		border-bottom: 2px solid #e9ecef;
	}

	td {
		padding: 0.75rem;
		border-bottom: 1px solid #e9ecef;
		vertical-align: top;
	}

	tr:hover {
		background-color: #f8f9fa;
	}

	tr:last-child td {
		border-bottom: none;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.summary-item {
			flex-direction: column;
		}
	}
</style>