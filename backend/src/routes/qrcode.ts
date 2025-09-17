import { Router } from 'express'
import QRCode from 'qrcode'
import { prisma } from '../prisma'

const router = Router()

router.get('/qrcode/:slug', async (req, res) => {
  try {
    const { slug } = req.params

    const link = await prisma.link.findUnique({
      where: { slug }
    })

    if (!link) {
      return res.status(404).json({ error: 'Not found' })
    }

    const baseUrl = process.env['BASE_URL'] || 'http://localhost:3000'
    const shortUrl = `${baseUrl}/${slug}`

    const qrBuffer = await QRCode.toBuffer(shortUrl, {
      type: 'png',
      width: 256,
      margin: 2
    })

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': qrBuffer.length.toString()
    })

    return res.send(qrBuffer)

  } catch (error) {
    console.error('QR code error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router