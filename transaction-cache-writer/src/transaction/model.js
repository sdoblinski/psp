const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
  host: process.env.POSTGRES_HOST,
  dialect: 'postgres'
})

const Model = Sequelize.Model
class Transaction extends Model {}
Transaction.init({
  value: {
    type: Sequelize.DECIMAL(10, 2)
  },
  description: {
    type: Sequelize.STRING(50)
  },
  payment_method: {
    type: Sequelize.ENUM('debit_card', 'credit_card')
  },
  card_number: {
    type: Sequelize.STRING(4)
  },
  card_expiration_date: {
    type: Sequelize.STRING(6)
  },
  card_ccv: {
    type: Sequelize.STRING(3)
  },
  client_id: {
    type: Sequelize.STRING(30)
  }
}, {
  sequelize,
  modelName: 'transaction'
})

module.exports = Transaction
