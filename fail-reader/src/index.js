const get = require('./get')
const express = require('express')
const app = express()
app.use(express.json())

const handler = async (req, res, channel) => {
  try {
    const fails = await get(channel)
    return res.status(200).send(fails)
  } catch (e) {
    console.error(e)
    if (e.statusCode && e.message) return res.status(e.statusCode).send({ message: e.message })
    return res.status(500).send('Fails could not be retrieved')
  }
}

app.get('/transactions/fails', (req, res) => handler(req, res, 'transactionFail'))
app.get('/playables/fails', (req, res) => handler(req, res, 'playableFail'))

app.listen(process.env.SERVICE_FAIL_READER_PORT)
