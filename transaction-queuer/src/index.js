const express = require('express')
const app = express()
app.use(express.json())

const validate = require('./transaction/validate')

const Redis = require('ioredis')
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

const pub = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST
})

app.post('/client/:clientId/transactions', async (req, res) => {
  try {
    const validData = validate(req)
    redis.subscribe('transactionReceived', (err) => {
      if (err) throw err
      pub.publish('transactionReceived', JSON.stringify(validData))
      return res.status(201).send({ message: 'Transaction successfully received' })
    })
  } catch (e) {
    console.error(e)
    if (e.statusCode && e.message) return res.status(e.statusCode).send({ message: e.message })
    return res.status(500).send({ message: 'Transaction could not be received' })
  }
})

app.listen(process.env.SERVICE_TRANSACTION_QUEUER_PORT)
