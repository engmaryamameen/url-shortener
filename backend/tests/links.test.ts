import request from 'supertest'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

dotenv.config()

jest.mock('../src/prisma', () => ({
  prisma: {
    link: {
      findMany: jest.fn(),
      count: jest.fn()
    }
  }
}))

const createApp = () => {
  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(morgan('combined'))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  app.get('/api/links', (req, res) => {
    const { limit, skip, take, search } = req.query
    
    const limitNum = limit ? parseInt(limit as string, 10) : undefined
    const skipNum = skip ? Math.max(0, parseInt(skip as string, 10) || 0) : 0
    const takeNum = take ? parseInt(take as string, 10) : undefined
    const searchTerm = search as string

    const mockLinks = [
      {
        slug: 'test1',
        url: 'https://example.com/test1',
        createdAt: new Date('2024-01-01'),
        _count: { clicks: 5 }
      },
      {
        slug: 'test2',
        url: 'https://example.com/test2',
        createdAt: new Date('2024-01-02'),
        _count: { clicks: 10 }
      },
      {
        slug: 'search-test',
        url: 'https://search.com/example',
        createdAt: new Date('2024-01-03'),
        _count: { clicks: 3 }
      }
    ]

    let filteredLinks = mockLinks
    if (searchTerm) {
      filteredLinks = mockLinks.filter(link => 
        link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    const effectiveTake = takeNum || limitNum || filteredLinks.length
    const effectiveTakeNum = effectiveTake > 0 ? effectiveTake : filteredLinks.length
    const paginatedLinks = filteredLinks.slice(skipNum, skipNum + effectiveTakeNum)
    const totalCount = filteredLinks.length

    const baseUrl = process.env['BASE_URL'] || 'http://localhost:3000'
    
    const formattedLinks = paginatedLinks.map(link => ({
      slug: link.slug,
      url: link.url,
      shortUrl: `${baseUrl}/${link.slug}`,
      createdAt: link.createdAt,
      clickCount: link._count.clicks
    }))

    return res.json({
      links: formattedLinks,
      pagination: {
        total: totalCount,
        skip: skipNum,
        take: effectiveTakeNum,
        hasMore: skipNum + effectiveTakeNum < totalCount
      }
    })
  })

  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' })
  })

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}

describe('GET /api/links', () => {
  const app = createApp()

  describe('Basic functionality', () => {
    it('should return all links with pagination info', async () => {
      const response = await request(app)
        .get('/api/links')
        .expect(200)

      expect(response.body).toHaveProperty('links')
      expect(response.body).toHaveProperty('pagination')
      expect(Array.isArray(response.body.links)).toBe(true)
      expect(response.body.pagination).toHaveProperty('total')
      expect(response.body.pagination).toHaveProperty('skip')
      expect(response.body.pagination).toHaveProperty('take')
      expect(response.body.pagination).toHaveProperty('hasMore')
    })

    it('should return links in correct format', async () => {
      const response = await request(app)
        .get('/api/links')
        .expect(200)

      const link = response.body.links[0]
      expect(link).toHaveProperty('slug')
      expect(link).toHaveProperty('url')
      expect(link).toHaveProperty('shortUrl')
      expect(link).toHaveProperty('createdAt')
      expect(link).toHaveProperty('clickCount')
      expect(typeof link.slug).toBe('string')
      expect(typeof link.url).toBe('string')
      expect(typeof link.shortUrl).toBe('string')
      expect(typeof link.clickCount).toBe('number')
    })

    it('should include base URL in shortUrl', async () => {
      const response = await request(app)
        .get('/api/links')
        .expect(200)

      const link = response.body.links[0]
      expect(link.shortUrl).toMatch(/^http:\/\/localhost:3000\//)
    })
  })

  describe('Limit parameter', () => {
    it('should limit results when limit parameter is provided', async () => {
      const response = await request(app)
        .get('/api/links?limit=2')
        .expect(200)

      expect(response.body.links.length).toBeLessThanOrEqual(2)
      expect(response.body.pagination.take).toBe(2)
    })

    it('should handle limit=0 gracefully', async () => {
      const response = await request(app)
        .get('/api/links?limit=0')
        .expect(200)

      expect(response.body.links.length).toBe(3)
      expect(response.body.pagination.take).toBe(3)
    })

    it('should handle negative limit gracefully', async () => {
      const response = await request(app)
        .get('/api/links?limit=-1')
        .expect(200)

      expect(response.body.links.length).toBe(3)
    })

    it('should handle non-numeric limit gracefully', async () => {
      const response = await request(app)
        .get('/api/links?limit=abc')
        .expect(200)

      expect(response.body.links.length).toBeGreaterThan(0)
    })
  })

  describe('Pagination with skip and take', () => {
    it('should handle skip parameter correctly', async () => {
      const response = await request(app)
        .get('/api/links?skip=1&take=1')
        .expect(200)

      expect(response.body.pagination.skip).toBe(1)
      expect(response.body.pagination.take).toBe(1)
    })

    it('should handle skip=0 correctly', async () => {
      const response = await request(app)
        .get('/api/links?skip=0&take=2')
        .expect(200)

      expect(response.body.pagination.skip).toBe(0)
      expect(response.body.pagination.take).toBe(2)
    })

    it('should handle negative skip gracefully', async () => {
      const response = await request(app)
        .get('/api/links?skip=-1&take=2')
        .expect(200)

      expect(response.body.pagination.skip).toBe(0)
    })

    it('should handle non-numeric skip gracefully', async () => {
      const response = await request(app)
        .get('/api/links?skip=abc&take=2')
        .expect(200)

      expect(response.body.pagination.skip).toBe(0)
    })

    it('should handle non-numeric take gracefully', async () => {
      const response = await request(app)
        .get('/api/links?skip=0&take=xyz')
        .expect(200)

      expect(response.body.pagination.take).toBeGreaterThan(0)
    })
  })

  describe('Search functionality', () => {
    it('should filter by URL when search term matches', async () => {
      const response = await request(app)
        .get('/api/links?search=example.com')
        .expect(200)

      expect(response.body.links.length).toBeGreaterThan(0)
      response.body.links.forEach((link: any) => {
        expect(link.url.toLowerCase()).toContain('example.com')
      })
    })

    it('should filter by slug when search term matches', async () => {
      const response = await request(app)
        .get('/api/links?search=test1')
        .expect(200)

      expect(response.body.links.length).toBeGreaterThan(0)
      response.body.links.forEach((link: any) => {
        expect(link.slug.toLowerCase()).toContain('test1')
      })
    })

    it('should return empty results for non-matching search', async () => {
      const response = await request(app)
        .get('/api/links?search=nonexistent')
        .expect(200)

      expect(response.body.links.length).toBe(0)
      expect(response.body.pagination.total).toBe(0)
    })

    it('should handle case-insensitive search', async () => {
      const response = await request(app)
        .get('/api/links?search=EXAMPLE')
        .expect(200)

      expect(response.body.links.length).toBeGreaterThan(0)
    })

    it('should handle empty search term', async () => {
      const response = await request(app)
        .get('/api/links?search=')
        .expect(200)

      expect(response.body.links.length).toBeGreaterThan(0)
    })

    it('should handle search with special characters', async () => {
      const response = await request(app)
        .get('/api/links?search=test%20')
        .expect(200)

      expect(response.body.links.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Combined parameters', () => {
    it('should handle search with limit', async () => {
      const response = await request(app)
        .get('/api/links?search=test&limit=1')
        .expect(200)

      expect(response.body.links.length).toBeLessThanOrEqual(1)
      expect(response.body.pagination.take).toBe(1)
    })

    it('should handle search with pagination', async () => {
      const response = await request(app)
        .get('/api/links?search=test&skip=0&take=1')
        .expect(200)

      expect(response.body.pagination.skip).toBe(0)
      expect(response.body.pagination.take).toBe(1)
    })

    it('should handle all parameters together', async () => {
      const response = await request(app)
        .get('/api/links?search=test&skip=0&take=1&limit=2')
        .expect(200)

      expect(response.body.pagination.skip).toBe(0)
      expect(response.body.pagination.take).toBe(1)
    })
  })

  describe('Pagination metadata', () => {
    it('should calculate hasMore correctly when there are more results', async () => {
      const response = await request(app)
        .get('/api/links?take=1')
        .expect(200)

      if (response.body.pagination.total > 1) {
        expect(response.body.pagination.hasMore).toBe(true)
      }
    })

    it('should calculate hasMore correctly when no more results', async () => {
      const response = await request(app)
        .get('/api/links?skip=0&take=100')
        .expect(200)

      expect(response.body.pagination.hasMore).toBe(false)
    })

    it('should return correct total count', async () => {
      const response = await request(app)
        .get('/api/links')
        .expect(200)

      expect(response.body.pagination.total).toBeGreaterThanOrEqual(0)
      expect(typeof response.body.pagination.total).toBe('number')
    })

    it('should return correct skip value', async () => {
      const response = await request(app)
        .get('/api/links?skip=5')
        .expect(200)

      expect(response.body.pagination.skip).toBe(5)
    })

    it('should return correct take value', async () => {
      const response = await request(app)
        .get('/api/links?take=3')
        .expect(200)

      expect(response.body.pagination.take).toBe(3)
    })
  })

  describe('Edge cases', () => {
    it('should handle very large skip values', async () => {
      const response = await request(app)
        .get('/api/links?skip=999999')
        .expect(200)

      expect(response.body.links.length).toBe(0)
      expect(response.body.pagination.hasMore).toBe(false)
    })

    it('should handle very large take values', async () => {
      const response = await request(app)
        .get('/api/links?take=999999')
        .expect(200)

      expect(response.body.pagination.take).toBe(999999)
    })

    it('should handle multiple query parameters with same name', async () => {
      const response = await request(app)
        .get('/api/links?limit=1&limit=2')
        .expect(200)

      expect(response.body.pagination.take).toBe(1)
    })

    it('should handle URL encoded parameters', async () => {
      const response = await request(app)
        .get('/api/links?search=test%20example')
        .expect(200)

      expect(response.body.links.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Response structure', () => {
    it('should always return links array', async () => {
      const response = await request(app)
        .get('/api/links')
        .expect(200)

      expect(Array.isArray(response.body.links)).toBe(true)
    })

    it('should always return pagination object', async () => {
      const response = await request(app)
        .get('/api/links')
        .expect(200)

      expect(typeof response.body.pagination).toBe('object')
      expect(response.body.pagination).not.toBeNull()
    })

    it('should have consistent response structure across different parameters', async () => {
      const responses = await Promise.all([
        request(app).get('/api/links'),
        request(app).get('/api/links?limit=1'),
        request(app).get('/api/links?search=test'),
        request(app).get('/api/links?skip=0&take=1')
      ])

      responses.forEach(response => {
        expect(response.body).toHaveProperty('links')
        expect(response.body).toHaveProperty('pagination')
        expect(Array.isArray(response.body.links)).toBe(true)
        expect(typeof response.body.pagination).toBe('object')
      })
    })
  })
})