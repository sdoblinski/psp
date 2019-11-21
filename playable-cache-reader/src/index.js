const getPlayablesByClientId = require('./playable/getByClientId')
const express = require('express')
const app = express()
app.use(express.json())
const requestValidate = require('./playable/validate')

app.get('/client/:clientId/playables', async (req, res) => {
  try {
    const validParams = requestValidate(req.params)
    const playables = await getPlayablesByClientId(validParams.clientId)
    return res.status(200).send(playables)
  } catch (e) {
    console.error(e)
    if (e.statusCode && e.message) return res.status(e.statusCode).send({ message: e.message })
    return res.status(500).send('Transaction could not be retrieved')
  }
})

app.listen(process.env.SERVICE_PLAYABLE_CACHE_READER_PORT)
