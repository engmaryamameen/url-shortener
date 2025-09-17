import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

router.get('/analytics/:slug', async (req, res) => {
  const { slug } = req.params;
  const link = await prisma.link.findUnique({
    where: { slug },
    include: {
      clicks: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  if (!link) return res.status(404).json({ error: 'Not found' });
  return res.json({
    url: link.url,
    totalClicks: link.clicks.length,
    recentClicks: link.clicks.map(c => ({
      ip: c.ip,
      userAgent: c.userAgent,
      referer: c.referer,
      date: c.createdAt,
    })),
  });
});

export default router;
