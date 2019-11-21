const schema = require('./requestSchema')
const createError = require('http-errors')

const validate = (req) => {
  const { error, value } = schema.validate({ params: req.params, body: req.body })
  if (error) {
    const messages = error.details.map(detail => detail.message)
    throw createError.BadRequest(messages.join(', '))
  }
  const validData = value.body
  validData.client_id = value.params.clientId
  return validData
}

module.exports = validate
