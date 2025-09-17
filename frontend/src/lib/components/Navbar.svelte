<nav class="navbar">
	<div class="nav-container">
		<a href="/" class="nav-brand">Shortly</a>
		<div class="nav-links">
			<a href="/new" class="nav-link">Create New</a>
			<a href="/links" class="nav-link">All Links</a>
		</div>
	</div>
</nav>

<style>
	.navbar {
		background-color: #f9f9f9;
		border-bottom: 1px solid #e5e5e5;
		position: sticky;
		top: 0;
		z-index: 100;
		backdrop-filter: blur(8px);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 4rem;
	}

	.nav-brand {
		font-size: 1.5rem;
		font-weight: 700;
		color: #333;
		text-decoration: none;
		letter-spacing: -0.025em;
		transition: color 0.2s ease;
	}

	.nav-brand:hover {
		color: #007bff;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-link {
		color: #333;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.95rem;
		position: relative;
		transition: color 0.2s ease;
		padding: 0.5rem 0;
	}

	.nav-link:hover {
		color: #007bff;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0;
		height: 2px;
		background-color: #007bff;
		transition: width 0.3s ease;
	}

	.nav-link:hover::after {
		width: 100%;
	}

	@media (max-width: 768px) {
		.nav-container {
			flex-direction: column;
			height: auto;
			padding: 1rem 1.5rem;
			gap: 1rem;
		}

		.nav-brand {
			font-size: 1.25rem;
		}

		.nav-links {
			gap: 1.5rem;
		}

		.nav-link {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.nav-container {
			padding: 0.75rem 1rem;
		}

		.nav-links {
			gap: 1rem;
		}

		.nav-link {
			font-size: 0.85rem;
		}
	}
</style>