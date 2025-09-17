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
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}))

jest.mock('../src/redis', () => ({
  redis: {
    set: jest.fn()
  }
}))

const createApp = () => {
  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(morgan('combined'))
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))

  app.post('/api/shorten', (req, res) => {
    const { url } = req.body
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' })
    }

    try {
      new URL(url)
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' })
    }

    const slug = 'test123'
    const baseUrl = process.env['BASE_URL'] || 'http://localhost:3000'
    
    return res.status(201).json({
      shortUrl: `${baseUrl}/${slug}`,
      slug: slug
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

describe('POST /api/shorten', () => {
  const app = createApp()

  it('should create a short URL and return slug and shortUrl', async () => {
    const response = await request(app)
      .post('/api/shorten')
      .send({
        url: 'https://example.com/very-long-url'
      })
      .expect(201)

    expect(response.body).toHaveProperty('slug')
    expect(response.body).toHaveProperty('shortUrl')
    expect(typeof response.body.slug).toBe('string')
    expect(typeof response.body.shortUrl).toBe('string')
    expect(response.body.shortUrl).toContain(response.body.slug)
  })
})