import { Router } from 'express'
import { nanoid } from 'nanoid'
import { prisma } from '../prisma'
import { redis } from '../redis'

const router = Router()

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const isValidSlug = (slug: string): boolean => {
  return /^[A-Za-z0-9-_]{3,64}$/.test(slug)
}

const generateUniqueSlug = async (): Promise<string> => {
  let slug: string
  let exists = true
  
  while (exists) {
    slug = nanoid(7)
    const link = await prisma.link.findUnique({ where: { slug } })
    exists = !!link
  }
  
  return slug!
}

router.post('/shorten', async (req, res) => {
  try {
    const { url, slug: customSlug, title } = req.body

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' })
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL format' })
    }

    let finalSlug: string

    if (customSlug) {
      if (typeof customSlug !== 'string' || !isValidSlug(customSlug)) {
        return res.status(400).json({ error: 'Invalid slug format' })
      }

      const existingLink = await prisma.link.findUnique({ where: { slug: customSlug } })
      if (existingLink) {
        return res.status(409).json({ error: 'Slug already exists' })
      }

      finalSlug = customSlug
    } else {
      finalSlug = await generateUniqueSlug()
    }

    const baseUrl = process.env['BASE_URL'] || 'http://localhost:3000'
    
    await prisma.link.create({
      data: {
        slug: finalSlug,
        url,
        title: title || null
      }
    })

    await redis.set(`slug:${finalSlug}`, url)

    return res.status(201).json({
      shortUrl: `${baseUrl}/${finalSlug}`,
      slug: finalSlug
    })

  } catch (error) {
    console.error('Shorten error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router