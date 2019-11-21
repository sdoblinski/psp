const Joi = require('@hapi/joi')

module.exports = Joi.object({
  clientId: Joi.string().max(30).pattern(/^\d+$/).required()
}).unknown(false)
