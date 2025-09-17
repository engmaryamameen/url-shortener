<footer class="footer">
	<div class="footer-container">
		<div class="footer-content">
			<div class="footer-brand">
				<h3>Shortly</h3>
				<p>Simple, fast, and reliable URL shortening</p>
			</div>
			<div class="footer-links">
				<div class="footer-section">
					<h4>Product</h4>
					<a href="/new">Create Link</a>
					<a href="/links">All Links</a>
				</div>
				<div class="footer-section">
					<h4>Features</h4>
					<a href="/">QR Codes</a>
					<a href="/">Analytics</a>
				</div>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; 2025 Shortly. Built with SvelteKit & Node.js</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background-color: #f9f9f9;
		border-top: 1px solid #e5e5e5;
		margin-top: auto;
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: 3rem 0 2rem;
		gap: 2rem;
	}

	.footer-brand h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
		font-weight: 700;
		color: #333;
		letter-spacing: -0.025em;
	}

	.footer-brand p {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.footer-links {
		display: flex;
		gap: 3rem;
	}

	.footer-section h4 {
		margin: 0 0 1rem 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #333;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.footer-section a {
		display: block;
		color: #666;
		text-decoration: none;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
		transition: color 0.2s ease;
	}

	.footer-section a:hover {
		color: #007bff;
	}

	.footer-bottom {
		border-top: 1px solid #e5e5e5;
		padding: 1.5rem 0;
		text-align: center;
	}

	.footer-bottom p {
		margin: 0;
		color: #999;
		font-size: 0.85rem;
	}

	@media (max-width: 768px) {
		.footer-content {
			flex-direction: column;
			padding: 2rem 0 1.5rem;
			gap: 2rem;
		}

		.footer-links {
			gap: 2rem;
		}

		.footer-section h4 {
			font-size: 0.9rem;
		}

		.footer-section a {
			font-size: 0.85rem;
		}

		.footer-bottom {
			padding: 1rem 0;
		}

		.footer-bottom p {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 480px) {
		.footer-container {
			padding: 0 1rem;
		}

		.footer-content {
			padding: 1.5rem 0 1rem;
		}

		.footer-links {
			flex-direction: column;
			gap: 1.5rem;
		}

		.footer-brand h3 {
			font-size: 1.1rem;
		}

		.footer-brand p {
			font-size: 0.85rem;
		}
	}
</style>