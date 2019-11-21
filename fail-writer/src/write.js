const Redis = require('ioredis')

const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  db: process.env.REDIS_FAIL_DB
})

module.exports = async (channel, deadLetter) => {
  await redis.lpush(channel.toString(), deadLetter.toString())
}
