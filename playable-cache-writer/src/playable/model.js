const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: process.env.POSTGRES_HOST,
  dialect: 'postgres'
})

const Model = Sequelize.Model
class Playable extends Model {}
Playable.init({
  value: {
    type: Sequelize.DECIMAL(10, 2)
  },
  client_id: {
    type: Sequelize.STRING(30)
  },
  status: {
    type: Sequelize.ENUM('paid', 'waiting_funds')
  },
  payment_date: {
    type: Sequelize.DATE
  }
}, {
  sequelize,
  modelName: 'playable'
})

module.exports = Playable
