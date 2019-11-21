const create = require('./transaction/create')
const fail = require('./transaction/fail')

const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

const pub = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

redis.subscribe('transactionReceived', (err) => {
  if (err) throw err
  redis.on('messageBuffer', async (channel, message) => {
    try {
      const transaction = JSON.parse(message.toString())
      const result = await create(transaction)
      pub.publish('transactionPersisted', JSON.stringify(result))
    } catch (e) {
      fail(e, channel, message)
      console.error(e)
    }
  })
})
