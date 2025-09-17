import { Router } from 'express'
import { prisma } from '../prisma'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      select: {
        slug: true,
        url: true,
        createdAt: true,
        _count: {
          select: {
            clicks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const baseUrl = process.env['BASE_URL'] || 'http://localhost:3000'
    
    const formattedLinks = links.map(link => ({
      slug: link.slug,
      url: link.url,
      shortUrl: `${baseUrl}/${link.slug}`,
      createdAt: link.createdAt,
      clickCount: link._count.clicks
    }))

    return res.json(formattedLinks)

  } catch (error) {
    console.error('Get links error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router