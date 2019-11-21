const Playable = require('./model')
const Moment = require('moment')

module.exports = (data) => {
  const playableData = { client_id: data.client_id }
  if (data.payment_method === 'debit_card') {
    playableData.status = 'paid'
    playableData.value = data.value - (data.value * parseFloat(process.env.FEE_DEBIT_CARD))
    playableData.payment_date = data.createdAt
  }
  if (data.payment_method === 'credit_card') {
    playableData.status = 'waiting_funds'
    playableData.value = data.value - (data.value * parseFloat(process.env.FEE_CREDIT_CARD))
    playableData.payment_date = Moment.utc(data.createdAt).add(process.env.PAYMENT_DATE_DAYS, 'days')
  }
  return Playable.create(playableData)
}
