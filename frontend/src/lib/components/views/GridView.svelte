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

	function truncateUrl(url: string, maxLength: number = 50) {
		return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
	}
</script>

<div class="grid-container">
	{#each links as link}
		<div class="link-card">
		<div class="card-header">
			<a href={link.shortUrl} target="_blank" rel="noopener noreferrer" class="slug-link">
				<h3 class="slug-title">{formatSlugDisplay(link.slug)}</h3>
				<span class="slug-code">/{link.slug}</span>
			</a>
		</div>
			
			<div class="card-content">
				<div class="url-info">
					<span class="url-label">Original URL:</span>
					<a href={link.url} target="_blank" rel="noopener noreferrer" class="original-url" title={link.url}>
						{truncateUrl(link.url)}
					</a>
				</div>
				
				<div class="stats">
					<div class="stat">
						<span class="stat-label">Clicks</span>
						<span class="stat-value">{link.clickCount}</span>
					</div>
					<div class="stat">
						<span class="stat-label">Created</span>
						<span class="stat-value">{formatDateTime(link.createdAt)}</span>
					</div>
				</div>
			</div>
			
			<div class="card-footer">
				<div class="qr-section">
					{#if link.qrCodeUrl}
						<img
							src={link.qrCodeUrl}
							alt="QR Code for {link.slug}"
							width="60"
							height="60"
						/>
					{:else}
						<div class="qr-placeholder"><span>QR</span></div>
					{/if}
				</div>
				<div class="actions">
					<a href="/analytics/{link.slug}" class="analytics-btn">Analytics</a>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
		padding: 0;
	}

	.link-card {
		background: white;
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		padding: 1rem;
		transition: box-shadow 0.2s, transform 0.2s;
	}

	.link-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.card-header {
		margin-bottom: 0.75rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid #f0f0f0;
	}

	.card-header .slug-link {
		text-decoration: none;
		color: inherit;
		display: block;
		transition: opacity 0.2s;
	}

	.card-header .slug-link:hover {
		opacity: 0.8;
	}

	.slug-title {
		margin: 0 0 0.25rem 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: #333;
	}

	.slug-code {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.8rem;
		color: #6c757d;
		background: #f8f9fa;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		border: 1px solid #e9ecef;
	}

	.card-content {
		margin-bottom: 1rem;
	}

	.url-info {
		margin-bottom: 0.75rem;
	}

	.url-label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		color: #666;
		margin-bottom: 0.25rem;
	}

	.original-url {
		color: #007bff;
		text-decoration: none;
		font-size: 0.9rem;
		word-break: break-all;
		line-height: 1.4;
	}

	.original-url:hover {
		text-decoration: underline;
	}

	.stats {
		display: flex;
		gap: 1rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		padding: 0.5rem;
		background: #f8f9fa;
		border-radius: 6px;
		border: 1px solid #e9ecef;
	}

	.stat-label {
		font-size: 0.75rem;
		color: #666;
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.stat-value {
		font-size: 0.9rem;
		font-weight: 600;
		color: #333;
	}

	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 0.75rem;
		border-top: 1px solid #f0f0f0;
	}

	.qr-section {
		display: flex;
		align-items: center;
	}

	.qr-section img {
		border-radius: 4px;
		border: 1px solid #e9ecef;
	}

	.qr-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		background-color: #f8f9fa;
		border: 1px dashed #dee2e6;
		border-radius: 4px;
		color: #6c757d;
		font-size: 0.8rem;
		text-align: center;
	}

	.actions {
		display: flex;
		align-items: center;
	}

	.analytics-btn {
		display: inline-block;
		padding: 0.5rem 1rem;
		background-color: #6c757d;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		font-size: 0.85rem;
		transition: background-color 0.2s;
	}

	.analytics-btn:hover {
		background-color: #5a6268;
	}

	@media (max-width: 768px) {
		.grid-container {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.link-card {
			padding: 0.75rem;
		}

		.stats {
			gap: 0.5rem;
		}

		.stat {
			padding: 0.4rem;
		}

		.card-footer {
			flex-direction: column;
			gap: 0.75rem;
			align-items: stretch;
		}

		.qr-section {
			justify-content: center;
		}

		.actions {
			justify-content: center;
		}
	}
</style>