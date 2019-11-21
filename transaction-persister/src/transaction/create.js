const Transaction = require('./model')

module.exports = async (data) => {
  return Transaction.create({
    client_id: data.client_id,
    value: data.value,
    description: data.description,
    payment_method: data.payment_method,
    card_number: data.card_number.substring(12),
    card_expiration_date: data.card_expiration_date,
    card_ccv: data.card_ccv,
    card_name: data.card_name
  })
}
