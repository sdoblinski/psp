const Joi = require('@hapi/joi')

module.exports = Joi.object({
  params: Joi.object({
    clientId: Joi.string().max(30).pattern(/^\d+$/).required()
  }).unknown(false),
  body: Joi.object({
    value: Joi.number().min(0.1).max(9999999999).required(),
    description: Joi.string().max(50).required(),
    payment_method: Joi.string().valid('debit_card', 'credit_card').required(),
    card_number: Joi.string().length(16).required(),
    card_name: Joi.string().max(30).required(),
    card_expiration_date: Joi.string().length(4).pattern(/^\d+$/).required(),
    card_ccv: Joi.string().length(3).pattern(/^\d+$/).required()
  }).unknown(false)
})
