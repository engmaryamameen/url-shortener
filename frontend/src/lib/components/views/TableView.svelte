<script lang="ts">
	export let links: Array<{
		slug: string;
		url: string;
		shortUrl: string;
		createdAt: string;
		clickCount: number;
		qrCodeUrl?: string;
	}> = [];

	function formatSlugDisplay(slug: string) {
		return slug
			.replace(/_/g, ' ')
			.replace(/-/g, ' ')
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	function formatDateTime(isoString: string) {
		return new Date(isoString).toLocaleDateString();
	}

	function truncateUrl(url: string, maxLength: number = 40) {
		return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
	}
</script>

<div class="table-container">
	<table>
		<thead>
			<tr>
				<th>Short URL</th>
                <th>Original URL</th>
				<th>Clicks</th>
				<th>Created</th>
				<th>QR Code</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each links as link}
				<tr>
                    <td>
						<a href={link.url} target="_blank" rel="noopener noreferrer" class="slug-link">
							<span class="slug-name">{formatSlugDisplay(link.slug)}</span>
							<span class="slug-url">/{link.slug}</span>
						</a>
					</td>
					<td title={link.url}>
						<a href={link.url} target="_blank" rel="noopener noreferrer">
							{truncateUrl(link.url)}
						</a>
					</td>
					<td class="click-count">{link.clickCount}</td>
					<td class="date-cell">{formatDateTime(link.createdAt)}</td>
					<td class="qr-cell">
						{#if link.qrCodeUrl}
							<img
								src={link.qrCodeUrl}
								alt="QR Code for {link.slug}"
								width="50"
								height="50"
							/>
						{:else}
							<div class="qr-placeholder-small"><span>QR</span></div>
						{/if}
					</td>
					<td class="actions-cell">
						<a href="/analytics/{link.slug}" class="analytics-btn-small">Analytics</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-container {
		overflow-x: auto;
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		background-color: white;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background-color: #f8f9fa;
		padding: 0.75rem 0.5rem;
		text-align: left;
		font-weight: 600;
		color: #555;
		border-bottom: 2px solid #e9ecef;
		font-size: 0.9rem;
	}

	td {
		padding: 0.75rem 0.5rem;
		border-bottom: 1px solid #e9ecef;
		vertical-align: middle;
		font-size: 0.9rem;
	}

	tr:hover {
		background-color: #f8f9fa;
	}

	tr:last-child td {
		border-bottom: none;
	}

	td a {
		color: #007bff;
		text-decoration: none;
		word-break: break-all;
	}

	td a:hover {
		text-decoration: underline;
	}

	.slug-link {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}

	.slug-name {
		font-weight: 600;
		color: #333;
		font-size: 0.9rem;
	}

	.slug-url {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.75rem;
		color: #6c757d;
		background: #f8f9fa;
		padding: 0.15rem 0.3rem;
		border-radius: 3px;
		border: 1px solid #e9ecef;
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

	.qr-placeholder-small {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		background-color: #f8f9fa;
		border: 1px dashed #dee2e6;
		border-radius: 4px;
		color: #6c757d;
		font-size: 0.7rem;
		text-align: center;
		margin: 0 auto;
	}

	.actions-cell {
		text-align: center;
		white-space: nowrap;
	}

	.analytics-btn-small {
		display: inline-block;
		padding: 0.3rem 0.6rem;
		background-color: #6c757d;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		font-size: 0.75rem;
		transition: background-color 0.2s;
	}

	.analytics-btn-small:hover {
		background-color: #5a6268;
	}

	@media (max-width: 768px) {
		th, td {
			padding: 0.5rem 0.25rem;
			font-size: 0.8rem;
		}

		.qr-cell img {
			width: 35px;
			height: 35px;
		}

		.qr-placeholder-small {
			width: 35px;
			height: 35px;
		}
	}
</style>