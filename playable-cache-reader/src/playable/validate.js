const schema = require('./requestSchema')
const createError = require('http-errors')

module.exports = (data) => {
  const { error, value } = schema.validate(data)
  if (error) {
    const messages = error.details.map(detail => detail.message)
    throw createError.BadRequest(messages.join(', '))
  }
  return value
}
