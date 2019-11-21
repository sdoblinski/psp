const Redis = require('ioredis')
const createError = require('http-errors')

const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  db: process.env.REDIS_FAIL_DB
})

module.exports = async (channel) => {
  const fails = await redis.lrange(channel, 0, -1)
  if (fails.length > 0) return fails.map(f => JSON.parse(f))
  throw createError.NotFound()
}
