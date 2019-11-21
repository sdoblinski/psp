const getTransactionsByClientId = require('./transaction/getByClientId')
const express = require('express')
const app = express()
app.use(express.json())
const requestValidate = require('./transaction/validate')

app.get('/client/:clientId/transactions', async (req, res) => {
  try {
    const validParams = requestValidate(req.params)
    const transactions = await getTransactionsByClientId(validParams.clientId)
    res.status(200).send(transactions)
  } catch (e) {
    console.error(e)
    if (e.statusCode && e.message) return res.status(e.statusCode).send({ message: e.message })
    return res.status(500).send('Transaction could not be retrieved')
  }
})

app.listen(process.env.SERVICE_TRANSACTION_CACHE_READER_PORT)
