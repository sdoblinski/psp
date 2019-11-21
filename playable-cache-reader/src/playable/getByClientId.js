const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  db: process.env.REDIS_CACHE_PLAYABLE_DB
})
const createError = require('http-errors')

module.exports = async (userId) => {
  const playables = await redis.smembers(userId)
  if (playables[0]) return JSON.parse(playables[0])
  throw createError.NotFound()
}
