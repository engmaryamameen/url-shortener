<script lang="ts">
	import { onMount } from 'svelte';
	import TableView from '$lib/components/views/TableView.svelte';
	import GridView from '$lib/components/views/GridView.svelte';
	import ViewToggle from '$lib/components/views/ViewToggle.svelte';

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

	let latestLinks: Array<{
		slug: string;
		url: string;
		shortUrl: string;
		createdAt: string;
		clickCount: number;
		qrCodeUrl?: string;
	}> = [];
	let latestLinksLoading = true;
	let viewMode: 'table' | 'grid' = 'table';

	onMount(async () => {
		await loadLatestLinks();
	});

	async function loadLatestLinks() {
		latestLinksLoading = true;
		try {
			const response = await fetch(`${BACKEND_URL}/api/links?limit=10`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch latest links');
			}

			const linksWithQR = await Promise.all(
				data.links.map(async (link: any) => ({
					...link,
					qrCodeUrl: await fetchQRCode(link.slug)
				}))
			);
			latestLinks = linksWithQR;
		} catch (err) {
			console.error('Failed to load latest links:', err);
		} finally {
			latestLinksLoading = false;
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

	function handleViewChange(view: 'table' | 'grid') {
		viewMode = view;
	}
</script>

<div class="container">
	<div class="hero-section">
		<div class="hero-content">
			<div class="hero-text">
				<h1>Shortly</h1>
				<p class="tagline">Transform long URLs into powerful, trackable short links</p>
				<div class="features">
					<div class="feature">
						<span class="feature-icon">📊</span>
						<span>Analytics</span>
					</div>
					<div class="feature">
						<span class="feature-icon">📱</span>
						<span>QR Codes</span>
					</div>
					<div class="feature">
						<span class="feature-icon">⚡</span>
						<span>Fast & Reliable</span>
					</div>
				</div>
			</div>
			<div class="hero-visual">
				<div class="url-demo">
					<div class="url-long">
						<span class="url-label">Before</span>
						<div class="url-text">https://example.com/very-long-url-with-many-parameters</div>
					</div>
					<div class="arrow">↓</div>
					<div class="url-short">
						<span class="url-label">After</span>
						<div class="url-text">short.ly/abc123</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="latest-section">
		<div class="section-header">
			<h2>Latest Links</h2>
			<div class="header-actions">
				<ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
				<a href="/links" class="view-more-btn">View All Links</a>
			</div>
		</div>

		{#if latestLinksLoading}
			<div class="loading">Loading latest links...</div>
		{:else if latestLinks.length === 0}
			<div class="no-links">
				<p>No links created yet. <a href="/new">Create your first one!</a></p>
			</div>
		{:else}
			{#if viewMode === 'table'}
				<TableView links={latestLinks} />
			{:else}
				<GridView links={latestLinks} />
			{/if}
		{/if}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		font-family: system-ui, -apple-system, sans-serif;
	}

	.hero-section {
		background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
		border-radius: 16px;
		margin-bottom: 3rem;
		overflow: hidden;
		position: relative;
	}

	.hero-section::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
		opacity: 0.3;
	}

	.hero-content {
		display: flex;
		align-items: center;
		gap: 3rem;
		padding: 3rem 2rem;
		position: relative;
		z-index: 1;
	}

	.hero-text {
		flex: 1;
		color: white;
	}

	.hero-text h1 {
		font-size: 3.5rem;
		font-weight: 800;
		margin-bottom: 1rem;
		background: linear-gradient(45deg, #ffffff, #e3f2fd);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		letter-spacing: -0.02em;
	}

	.tagline {
		font-size: 1.3rem;
		margin-bottom: 2rem;
		opacity: 0.9;
		line-height: 1.5;
	}

	.features {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.feature {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.1);
		padding: 0.75rem 1.25rem;
		border-radius: 25px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
	}

	.feature-icon {
		font-size: 1.2rem;
	}

	.hero-visual {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.url-demo {
		background: rgba(255, 255, 255, 0.95);
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.url-long, .url-short {
		text-align: center;
		margin-bottom: 1rem;
	}

	.url-short {
		margin-bottom: 0;
	}

	.url-label {
		display: block;
		font-size: 0.8rem;
		font-weight: 600;
		color: #666;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.url-text {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: 0.9rem;
		padding: 0.75rem 1rem;
		background: #f8f9fa;
		border-radius: 6px;
		border: 1px solid #e9ecef;
		word-break: break-all;
		color: #333;
	}

	.url-short .url-text {
		background: #e8f5e8;
		border-color: #c3e6cb;
		color: #155724;
		font-weight: 600;
	}

	.arrow {
		text-align: center;
		font-size: 1.5rem;
		color: #007bff;
		margin: 0.5rem 0;
		font-weight: bold;
	}

	.latest-section {
		background-color: white;
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		padding: 1.5rem;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	h2 {
		color: #333;
		margin: 0;
	}

	.view-more-btn {
		display: inline-block;
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		text-decoration: none;
		border-radius: 4px;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.view-more-btn:hover {
		background-color: #0056b3;
	}

	.loading, .no-links {
		text-align: center;
		padding: 2rem;
		color: #666;
		background-color: #f8f8f8;
		border-radius: 8px;
	}


	@media (max-width: 768px) {
		.container {
			padding: 0.75rem;
		}

		.hero-content {
			flex-direction: column;
			gap: 2rem;
			padding: 2rem 1rem;
		}

		.hero-text h1 {
			font-size: 2.5rem;
		}

		.tagline {
			font-size: 1.1rem;
		}

		.features {
			gap: 1rem;
		}

		.feature {
			padding: 0.5rem 1rem;
		}

		.url-demo {
			padding: 1.5rem;
		}

		.url-text {
			font-size: 0.8rem;
			padding: 0.5rem 0.75rem;
		}

		.latest-section {
			padding: 1rem;
		}

		.section-header {
			flex-direction: column;
			gap: 1rem;
			align-items: stretch;
		}

		.header-actions {
			justify-content: space-between;
		}

		.view-more-btn {
			text-align: center;
		}
	}
</style>