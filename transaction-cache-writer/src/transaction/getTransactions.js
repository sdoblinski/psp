const Transaction = require('./model')
const Moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = async (clientId, lastDays) => {
  const result = await Transaction.findAll({
    attributes: [
      'client_id',
      'value',
      'description',
      'payment_method',
      'card_number',
      'card_expiration_date',
      'card_ccv',
      'card_name',
      'createdAt'
    ],
    where: {
      client_id: clientId,
      createdAt: {
        [Op.gte]: Moment.utc().subtract(lastDays, 'days').format('YYYY-MM-DD')
      }
    },
    order: [['createdAt', 'DESC']],
    raw: true
  })
  return result
}
