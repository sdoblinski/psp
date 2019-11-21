const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

const pub = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

const fail = (e, topic, msg) => {
  const deadLetter = {
    time: new Date().getTime(),
    e,
    topic: topic.toString(),
    msg: JSON.parse(msg.toString())
  }
  try {
    redis.subscribe('transactionFail', (err) => {
      if (err) throw err
      pub.publish('transactionFail', JSON.stringify(deadLetter))
    })
  } catch (e) {
    console.error(e)
  }
}

module.exports = fail
