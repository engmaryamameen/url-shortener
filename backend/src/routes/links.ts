import { Router } from 'express'
import { prisma } from '../prisma'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { limit, skip, take, search, sort } = req.query
    
    const limitNum = limit ? parseInt(limit as string, 10) : undefined
    const skipNum = skip ? parseInt(skip as string, 10) : 0
    const takeNum = take ? parseInt(take as string, 10) : undefined
    const searchTerm = search as string
    const sortParam = sort as string

    const whereClause = searchTerm ? {
      OR: [
        { url: { contains: searchTerm, mode: 'insensitive' as const } },
        { slug: { contains: searchTerm, mode: 'insensitive' as const } }
      ]
    } : {}

    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortParam) {
      case 'az':
        orderBy = { slug: 'asc' }
        break
      case 'za':
        orderBy = { slug: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
    }

    const links = await prisma.link.findMany({
      where: whereClause,
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
      orderBy,
      ...(limitNum && { take: limitNum }),
      ...(skipNum > 0 && { skip: skipNum }),
      ...(takeNum && { take: takeNum })
    })

    const totalCount = await prisma.link.count({ where: whereClause })

    const baseUrl = process.env['BASE_URL'] || 'http://localhost:3000'
    
    const formattedLinks = links.map(link => ({
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
        take: takeNum || limitNum || totalCount,
        hasMore: skipNum + (takeNum || limitNum || totalCount) < totalCount
      }
    })

  } catch (error) {
    console.error('Get links error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router