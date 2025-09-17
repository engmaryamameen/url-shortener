<script lang="ts">
	import { onMount } from 'svelte';
	import TableView from '$lib/components/views/TableView.svelte';
	import GridView from '$lib/components/views/GridView.svelte';
	import ViewToggle from '$lib/components/views/ViewToggle.svelte';

	const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

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
	let searchTerm = '';
	let currentPage = 0;
	let totalCount = 0;
	let hasMore = false;
	const pageSize = 20;
	let viewMode: 'table' | 'grid' = 'table';

	onMount(async () => { await loadLinks() });

	async function loadLinks() {
		loading = true;
		error = '';
		
		try {
			const skip = currentPage * pageSize;
			const params = new URLSearchParams({
				skip: skip.toString(),
				take: pageSize.toString()
			});
			
			if (searchTerm.trim()) {
				params.append('search', searchTerm.trim());
			}

			const response = await fetch(`${BACKEND_URL}/api/links?${params}`);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to fetch links');
			}

			const linksWithQR = await Promise.all(
				data.links.map(async (link: any) => ({
					...link,
					qrCodeUrl: await fetchQRCode(link.slug)
				}))
			);
			
			links = linksWithQR;
			totalCount = data.pagination.total;
			hasMore = data.pagination.hasMore;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	}

	async function handleSearch() {
		currentPage = 0;
		await loadLinks();
	}

	async function handlePageChange(direction: 'prev' | 'next') {
		if (direction === 'prev' && currentPage > 0) {
			currentPage--;
		} else if (direction === 'next' && hasMore) {
			currentPage++;
		}
		await loadLinks();
	}

	async function fetchQRCode(slug: string): Promise<string | undefined> {
		try {
			const response = await fetch(`${BACKEND_URL}/api/qrcode/${slug}`);
			if (!response.ok) {
				return undefined;
			}
			const blob = await response.blob();
			return URL.createObjectURL(blob);
		} catch (err) {
			return undefined;
		}
	}
	
	function getTotalPages() {
		return Math.ceil(totalCount / pageSize);
	}

	function handleViewChange(view: 'table' | 'grid') {
		viewMode = view;
	}
</script>

<div class="container">
	<div class="header">
		<h2>All Links</h2>
		<div class="search-section">
			<div class="search-container">
				<div class="search-input-wrapper">
					<div class="search-icon">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="11" cy="11" r="8"/>
							<path d="m21 21-4.35-4.35"/>
						</svg>
					</div>
					<input
						type="text"
						bind:value={searchTerm}
						placeholder="Search by URL or slug..."
						on:keydown={(e) => e.key === 'Enter' && handleSearch()}
						class="search-input"
					/>
					{#if searchTerm}
						<button class="clear-btn" on:click={() => { searchTerm = ''; handleSearch(); }}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<line x1="18" y1="6" x2="6" y2="18"/>
								<line x1="6" y1="6" x2="18" y2="18"/>
							</svg>
						</button>
					{/if}
				</div>
				<button class="search-btn" on:click={handleSearch} disabled={loading}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="11" cy="11" r="8"/>
						<path d="m21 21-4.35-4.35"/>
					</svg>
					<span>Search</span>
				</button>
			</div>
			<ViewToggle currentView={viewMode} onViewChange={handleViewChange} />
		</div>
	</div>

	{#if loading}
		<div class="loading">Loading links...</div>
	{:else if error}
		<div class="error">
			<h2>Error</h2>
			<p>{error}</p>
		</div>
	{:else if links.length === 0}
		<div class="no-links">
			<p>
				{searchTerm ? 'No links found matching your search.' : 'No links found.'}
				{#if !searchTerm}
					<a href="/">Create your first one!</a>
				{/if}
			</p>
		</div>
	{:else}
		<div class="results-info">
			<p>
				Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalCount)} of {totalCount} links
				{searchTerm ? ` matching "${searchTerm}"` : ''}
			</p>
		</div>

		{#if viewMode === 'table'}
			<TableView {links} />
		{:else}
			<GridView {links} />
		{/if}

		{#if getTotalPages() > 1}
			<div class="pagination">
				<button 
					on:click={() => handlePageChange('prev')} 
					disabled={currentPage === 0 || loading}
					class="pagination-btn"
				>
					Previous
				</button>
				
				<span class="page-info">
					Page {currentPage + 1} of {getTotalPages()}
				</span>
				
				<button 
					on:click={() => handlePageChange('next')} 
					disabled={!hasMore || loading}
					class="pagination-btn"
				>
					Next
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem;
		font-family: system-ui, -apple-system, sans-serif;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	h1 {
		margin: 0;
		color: #333;
	}

	.search-section {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.search-container {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		background: white;
		border: 2px solid #e1e5e9;
		border-radius: 8px;
		transition: border-color 0.2s, box-shadow 0.2s;
		min-width: 300px;
	}

	.search-input-wrapper:focus-within {
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}

	.search-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0.75rem;
		color: #6c757d;
	}

	.search-input {
		flex: 1;
		padding: 0.75rem 0.5rem;
		border: none;
		outline: none;
		font-size: 1rem;
		background: transparent;
		color: #333;
	}

	.search-input::placeholder {
		color: #6c757d;
	}

	.clear-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		margin-right: 0.5rem;
		background: none;
		border: none;
		color: #6c757d;
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.2s, color 0.2s;
	}

	.clear-btn:hover {
		background-color: #f8f9fa;
		color: #495057;
	}

	.search-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
	}

	.search-btn:hover:not(:disabled) {
		background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
		box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
		transform: translateY(-1px);
	}

	.search-btn:disabled {
		background: #6c757d;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.results-info {
		margin-bottom: 1rem;
		color: #666;
		font-size: 0.9rem;
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

	.no-links a {
		color: #007bff;
		text-decoration: none;
	}

	.no-links a:hover {
		text-decoration: underline;
	}



	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.pagination-btn {
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.pagination-btn:hover:not(:disabled) {
		background-color: #0056b3;
	}

	.pagination-btn:disabled {
		background-color: #6c757d;
		cursor: not-allowed;
	}

	.page-info {
		color: #666;
		font-size: 0.9rem;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.container {
			padding: 0.75rem;
		}

		.header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.search-section {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.search-container {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}

		.search-input-wrapper {
			min-width: unset;
			width: 100%;
		}

		.search-btn {
			width: 100%;
			justify-content: center;
		}

		.pagination {
			flex-direction: column;
			gap: 0.5rem;
		}
	}
</style>