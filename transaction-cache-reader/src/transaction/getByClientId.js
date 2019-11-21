const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  db: process.env.REDIS_CACHE_TRANSACTION_DB
})
const createError = require('http-errors')

module.exports = async (userId) => {
  const transactions = await redis.smembers(userId)
  if (transactions[0]) return JSON.parse(transactions[0])
  throw createError.NotFound()
}
