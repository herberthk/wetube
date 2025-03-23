import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://logical-kiwi-40447.upstash.io',
  token: process.env.REDIS_TOKEN,
})

export default redis
