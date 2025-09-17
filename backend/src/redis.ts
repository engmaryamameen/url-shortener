import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const redis = new Redis(process.env['REDIS_URL'] || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  lazyConnect: true
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
  process.exit(1)
})

redis.on('connect', () => {
  console.log('Redis connected')
})

export { redis }