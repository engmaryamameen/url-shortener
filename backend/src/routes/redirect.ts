import { Router } from 'express'
import { prisma } from '../prisma'
import { redis } from '../redis'
import { Prisma } from '@prisma/client'

const router = Router()

router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    let url: string | null = null
    let link: any = null

    const cachedUrl = await redis.get(`slug:${slug}`)
    if (cachedUrl) {
      url = cachedUrl
      link = await prisma.link.findUnique({ where: { slug } })
    } else {
      link = await prisma.link.findUnique({
        where: { slug }
      })

      if (!link) {
        return res.status(404).json({ error: 'Not found' })
      }

      url = link.url
      await redis.set(`slug:${slug}`, url!)
    }

    if (!link) {
      return res.status(404).json({ error: 'Not found' })
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.link.update({
        where: { id: link.id },
        data: { clickCount: { increment: 1 } }
      })

      await tx.click.create({
        data: {
          linkId: link.id,
          ip: req.ip || req.connection.remoteAddress || null,
          userAgent: req.headers['user-agent'] || null,
          referer: req.headers['referer'] || null
        }
      })
    })

    return res.redirect(302, url!)

  } catch (error) {
    console.error('Redirect error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router