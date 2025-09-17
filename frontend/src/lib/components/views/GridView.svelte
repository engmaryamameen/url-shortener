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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
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
         <div class="actions">
           <a href="/analytics/{link.slug}" class="analytics-btn" title="View Analytics">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M3 3v18h18"/>
               <path d="M9 9l3 3 3-3"/>
             </svg>
           </a>
         </div>
      </div>

      <div class="card-content">
        <div class="url-info">
          <span class="url-label">Original URL:</span>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            class="original-url"
            title={link.url}
          >
            {truncateUrl(link.url)}
          </a>
        </div>
        <div class="qr-section">
          {#if link.qrCodeUrl}
            <img src={link.qrCodeUrl} alt="QR Code for {link.slug}" width="60" height="60" />
          {:else}
            <div class="qr-placeholder"><span>QR</span></div>
          {/if}
        </div>
      </div>

      <div class="card-footer">
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
    </div>
  {/each}
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
    padding: 0;
  }

  .link-card {
    background: white;
    border: 1px solid #e1e5e9;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .link-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #007bff, #0056b3, #28a745);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .link-card:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    border-color: #007bff;
  }

  .link-card:hover::before {
    opacity: 1;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .card-header .slug-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: all 0.2s;
  }

  .card-header .slug-link:hover {
    opacity: 0.8;
    transform: translateX(2px);
  }

  .slug-title {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
    letter-spacing: -0.02em;
  }

  .slug-code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.85rem;
    color: #6c757d;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    border: 1px solid #e9ecef;
    display: inline-block;
    font-weight: 500;
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
    width: 100%;
  }

   .stat {
     display: flex;
     flex-direction: column;
     align-items: center;
     flex: 1;
     padding: 0.75rem 0.5rem;
     background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
     border-radius: 8px;
     border: 1px solid #e9ecef;
     transition: all 0.2s;
   }

  .stat:hover {
    background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
    transform: translateY(-1px);
  }

   .stat-label {
     font-size: 0.75rem;
     color: #6c757d;
     font-weight: 600;
     margin-bottom: 0.25rem;
     text-transform: uppercase;
     letter-spacing: 0.5px;
   }

   .stat-value {
     font-size: 1rem;
     font-weight: 700;
     color: #2c3e50;
   }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid #f0f0f0;
    gap: 1rem;
  }

  .qr-section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    margin-top: 1rem;
  }

  .qr-section img {
    border-radius: 4px;
    width: 160px;
    height: 200px;
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
     display: inline-flex;
     align-items: center;
     justify-content: center;
     width: 36px;
     height: 36px;
     background: #6c757d;
     color: white;
     text-decoration: none;
     border-radius: 6px;
     transition: all 0.2s ease;
   }

   .analytics-btn:hover {
     background: #5a6268;
     transform: translateY(-1px);
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
      gap: 1rem;
      align-items: center;
    }

    .qr-section {
      justify-content: center;
    }

    .actions {
      justify-content: center;
    }
  }
</style>
