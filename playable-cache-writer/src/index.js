const getPlayables = require('./playable/get')
const writeCache = require('./playable/writeCache')

const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

redis.subscribe('playablePersisted', (err) => {
  if (err) throw err
  try {
    redis.on('messageBuffer', async (channel, message) => {
      const clientId = JSON.parse(message.toString()).client_id
      const playables = await getPlayables(clientId, process.env.REDIS_CACHE_SIZE_DAYS)
      await writeCache(clientId, playables)
    })
  } catch (e) {
    console.error(e)
  }
})
