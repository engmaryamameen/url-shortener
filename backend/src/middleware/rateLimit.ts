import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { redis } from '../redis'

const globalLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) => redis.call(command, ...args) as any,
    prefix: 'rl:global:'
  }),
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false
})

const shortenLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (command: string, ...args: string[]) => redis.call(command, ...args) as any,
    prefix: 'rl:shorten:'
  }),
  windowMs: 15 * 60 * 1000,
  max: process.env['NODE_ENV'] === 'production' ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false
})

export { globalLimiter, shortenLimiter }