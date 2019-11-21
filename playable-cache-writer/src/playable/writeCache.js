const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  db: process.env.REDIS_CACHE_PLAYABLE_DB
})
const Moment = require('moment')

module.exports = async (userId, playables) => {
  await redis.del(userId)
  await redis.sadd(userId, JSON.stringify(playables))
  const expirationDate = Moment.utc().add(process.env.REDIS_CACHE_EXPIRATION_DAYS, 'days').format('X')
  await redis.expireat(userId, expirationDate)
}
