# URL Shortener

A production-grade URL shortener with analytics, QR code generation, rate limiting, and modern frontend.

## Features

- Create short links with optional custom slugs
- Redirect with Redis caching for speed
- Analytics tracking (clicks, IP, user agent, referer, date)
- QR code generation per link
- Pagination, search, and sorting (A–Z, Z–A, newest, oldest)
- Table and Grid views in the frontend
- Rate limiting for abuse protection
- Docker + GitHub Actions CI pipeline

## Tech Stack

- **Frontend**: SvelteKit (TypeScript)
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Cache/Rate Limiting**: Redis
- **ORM**: Prisma
- **Tests**: Jest + Supertest
- **CI/CD**: GitHub Actions
- **Containerization**: Docker & Docker Compose

## Architecture

```
[ User (Browser) ]
│
▼
[ Frontend (SvelteKit) ]
│
▼
┌───────────────────────────────┐
│ Backend (Express)             │
│ - /api/shorten                │
│ - /api/redirect/:slug         │
│ - /api/analytics/:slug        │
│ - /api/qrcode/:slug           │
│ - /api/links                  │
│ - Middleware: rate limiting   │
└───────────────────────────────┘
│
┌──────┴────────────┐
│                   │
▼                   ▼
[ PostgreSQL ]      [ Redis ]
Links & clicks      Cache
Analytics           Rate limits
```

## Quickstart

```bash
git clone https://github.com/engmaryamameen/url-shortener.git
   cd url-shortener
docker compose up --build
```

- Backend → http://localhost:3000
- Frontend → http://localhost:5173

## Tests

```bash
cd backend
npm test
```


## License

MIT