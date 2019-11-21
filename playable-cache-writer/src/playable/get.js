const Playable = require('./model')
const Moment = require('moment')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

module.exports = async (clientId, lastDays) => {
  const result = await Playable.findAll({
    attributes: [
      'status',
      [Sequelize.fn('sum', Sequelize.col('value')), 'total']
    ],
    where: {
      client_id: clientId,
      createdAt: {
        [Op.gte]: Moment.utc().subtract(lastDays, 'days').format('YYYY-MM-DD')
      }
    },
    group: ['status'],
    raw: true
  })
  return result
}
