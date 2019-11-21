const write = require('./write')

const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

redis.subscribe('transactionFail', 'playableFail', (err) => {
  if (err) throw err
  try {
    redis.on('messageBuffer', async (channel, message) => {
      await write(channel, message)
    })
  } catch (e) {
    console.error(e)
  }
})
