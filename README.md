# Project 04 — URL Shortener

A modern URL shortener service that creates short links and provides detailed analytics tracking for click data and user engagement.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Aliases**: Create custom short codes for branded links
- **Analytics Dashboard**: Track clicks, geographic data, and referral sources
- **QR Code Generation**: Generate QR codes for easy mobile sharing
- **Link Management**: Edit, delete, and organize your shortened URLs
- **Bulk Operations**: Import/export multiple URLs at once
- **API Access**: RESTful API for programmatic access
- **Rate Limiting**: Built-in protection against abuse

## Tech Stack

- **Backend**: Node.js with Express.js framework
- **Database**: PostgreSQL for persistent data storage
- **Cache**: Redis for high-performance caching and session management
- **Frontend**: Vue.js or Svelte for modern, reactive user interface
- **Infrastructure**: Docker containers with docker-compose for local development

## Quickstart

1. Clone the repository:
   ```bash
   git clone https://github.com/engmaryamameen/URL-Shortener.git
   cd URL-Shortener
   ```

2. Start the development environment:
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - Backend API: http://localhost:3000
   - Database: localhost:5432
   - Redis: localhost:6379

## Deployment

- **Frontend**: Deploy to Vercel for global CDN and automatic deployments
- **Backend**: Deploy to Render or AWS (EC2/ECS) for scalable server infrastructure
- **Database**: Use managed PostgreSQL services (AWS RDS, Render PostgreSQL, or Supabase)
- **Cache**: Deploy Redis on AWS ElastiCache or use managed Redis services

## License

MIT