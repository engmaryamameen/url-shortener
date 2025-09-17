import Redis from 'ioredis'
import dotenv from 'dotenv'

dotenv.config()

const redis = new Redis(process.env['REDIS_URL'] || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  enableReadyCheck: false
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('connect', () => {
  console.log('Redis connected')
})

redis.on('ready', () => {
  console.log('Redis ready')
})

const ensureRedisConnection = async () => {
  try {
    if (redis.status === 'connecting' || redis.status === 'connect') {
      return
    }
    
    if (redis.status === 'ready') {
      console.log('Redis already connected')
      return
    }
    
    await redis.connect()
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
    throw error
  }
}

export { redis, ensureRedisConnection }