const getTransactions = require('./transaction/getTransactions')
const writeCache = require('./transaction/writeCache')

const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

redis.subscribe('transactionPersisted', (err) => {
  if (err) throw err
  try {
    redis.on('messageBuffer', async (channel, message) => {
      const clientId = JSON.parse(message.toString()).client_id
      const transactions = await getTransactions(clientId, process.env.REDIS_CACHE_SIZE_DAYS)
      await writeCache(clientId, transactions)
    })
  } catch (e) {
    console.error(e)
  }
})
