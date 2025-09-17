<script lang="ts">
	export let currentView: 'table' | 'grid' = 'table';
	export let onViewChange: (view: 'table' | 'grid') => void;
</script>

<div class="view-toggle">
	<button 
		class="toggle-btn {currentView === 'table' ? 'active' : ''}"
		on:click={() => onViewChange('table')}
		title="Table View"
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
			<line x1="9" y1="9" x2="15" y2="9"/>
			<line x1="9" y1="15" x2="15" y2="15"/>
			<line x1="9" y1="3" x2="9" y2="21"/>
			<line x1="15" y1="3" x2="15" y2="21"/>
		</svg>
		<span>Table</span>
	</button>
	
	<button 
		class="toggle-btn {currentView === 'grid' ? 'active' : ''}"
		on:click={() => onViewChange('grid')}
		title="Grid View"
	>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<rect x="3" y="3" width="7" height="7"/>
			<rect x="14" y="3" width="7" height="7"/>
			<rect x="14" y="14" width="7" height="7"/>
			<rect x="3" y="14" width="7" height="7"/>
		</svg>
		<span>Grid</span>
	</button>
</div>

<style>
	.view-toggle {
		display: flex;
		background: #f8f9fa;
		border-radius: 6px;
		padding: 0.25rem;
		border: 1px solid #e9ecef;
	}

	.toggle-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: transparent;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		font-weight: 500;
		color: #6c757d;
		transition: all 0.2s;
	}

	.toggle-btn:hover {
		background: #e9ecef;
		color: #495057;
	}

	.toggle-btn.active {
		background: #007bff;
		color: white;
		box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
	}

	.toggle-btn svg {
		flex-shrink: 0;
	}

	.toggle-btn span {
		white-space: nowrap;
	}

	@media (max-width: 480px) {
		.toggle-btn span {
			display: none;
		}
		
		.toggle-btn {
			padding: 0.5rem;
		}
	}
</style>