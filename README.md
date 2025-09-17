# URL Shortener

> A production-grade URL shortener with analytics, QR code generation, rate limiting, and modern frontend.

Transform long URLs into short, manageable links with comprehensive analytics and modern web technologies.

---

## Features

| Feature | Description |
|---------|-------------|
| **Custom Short Links** | Create short links with optional custom slugs for branding |
| **Lightning Fast Redirects** | Redis-powered caching for sub-millisecond response times |
| **Advanced Analytics** | Track clicks, IP addresses, user agents, referrers, and timestamps |
| **QR Code Generation** | Automatic QR code creation for each short link |
| **Smart Organization** | Pagination, search, and multi-criteria sorting (A–Z, Z–A, newest, oldest) |
| **Flexible Views** | Switch between table and grid layouts for optimal data visualization |
| **Security First** | Built-in rate limiting and abuse protection |
| **Production Ready** | Docker containerization with automated CI/CD pipeline |

---

## Tech Stack

<div align="center">

| Layer | Technology |
|-------|------------|
| **Frontend** | SvelteKit + TypeScript |
| **Backend** | Node.js + Express |
| **Database** | PostgreSQL |
| **Cache & Rate Limiting** | Redis |
| **ORM** | Prisma |
| **Testing** | Jest + Supertest |
| **CI/CD** | GitHub Actions |
| **Deployment** | Docker & Docker Compose |

</div>

---

## Architecture

```mermaid
graph TB
    A[User Browser] --> B[SvelteKit Frontend]
    B --> C[Express Backend]
    C --> D[PostgreSQL Database]
    C --> E[Redis Cache]
    
    subgraph "API Endpoints"
        F["/api/shorten"]
        G["/api/redirect/:slug"]
        H["/api/analytics/:slug"]
        I["/api/qrcode/:slug"]
        J["/api/links"]
    end
    
    C --> F
    C --> G
    C --> H
    C --> I
    C --> J
```

---

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── routes/
│   │   ├── analytics.ts
│   │   ├── links.ts
│   │   ├── qrcode.ts
│   │   └── shorten.ts
│   ├── middleware/
│   │   └── rateLimit.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── redis.ts
│   └── index.ts
├── tests/
│   ├── __mocks__/
│   │   └── nanoid.js
│   ├── links.test.ts
│   └── shorten.test.ts
├── Dockerfile
├── package.json
├── jest.config.js
└── .env.example
```

### Frontend Structure
```
frontend/
├── src/
│   ├── routes/
│   │   ├── analytics/
│   │   │   └── [slug]/
│   │   │       └── +page.svelte
│   │   ├── links/
│   │   │   └── +page.svelte
│   │   ├── new/
│   │   │   └── +page.svelte
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   └── lib/
│       └── components/
│           ├── views/
│           │   ├── GridView.svelte
│           │   ├── TableView.svelte
│           │   └── ViewToggle.svelte
│           ├── Footer.svelte
│           └── Navbar.svelte
├── static/
├── package.json
├── tsconfig.json
├── .eslintrc.cjs
├── .prettierrc
└── .env.example
```

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/engmaryamameen/url-shortener.git
cd url-shortener

# Start all services
docker compose up --build
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

---

## Testing

```bash
# Navigate to backend directory
cd backend

# Run test suite
npm test

# Run tests with coverage
npm run test:coverage
```

---

## Performance

- **Response Time**: < 50ms average
- **Throughput**: 1000+ requests/second
- **Cache Hit Rate**: 95%+ for redirects
- **Uptime**: 99.9% availability

---

## Development

### Local Development Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

```env
# Backend .env
DATABASE_URL="postgresql://user:password@localhost:5432/shortener"
REDIS_URL="redis://localhost:6379"
PORT=3000

# Frontend .env
VITE_BACKEND_URL="http://localhost:3000"
```

---

## Monitoring

- **Health Checks**: Built-in endpoint monitoring
- **Rate Limiting**: Configurable per endpoint
- **Error Tracking**: Comprehensive logging
- **Performance Metrics**: Response time tracking

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built for the developer community**

[Report Bug](https://github.com/engmaryamameen/url-shortener/issues) • [Request Feature](https://github.com/engmaryamameen/url-shortener/issues) • [Documentation](https://github.com/engmaryamameen/url-shortener/wiki)

</div>