const axios = require('axios')
const { Observable } = require('rxjs')

const Redis = require('ioredis')
const redis = new Redis({
  port: '6379',
  host: 'localhost'
})

const baseUrl = 'http://localhost:8080'

const clientId = '1'

const validBody = {
  value: 2.99,
  description: 'Água Mineral 1L',
  payment_method: 'debit_card',
  card_number: '5370388222537383',
  card_name: 'John Doe',
  card_expiration_date: '0422',
  card_ccv: '999'
}

describe('Scenario: Transaction Process Success', () => {
  test('Debit Card Transaction shoud return statusCode 201 with correct messages', async (done) => {
    let messagesReceived = 0
    const messagesToReceive = 3
    const messages = {}

    const observable = new Observable(function subscribe (subscriber) {
      try {
        redis.subscribe('transactionReceived', 'transactionPersisted', 'playablePersisted', async (err) => {
          if (err) throw err
          redis.on('messageBuffer', async (channel, message) => {
            messagesReceived++
            subscriber.next({
              channel: channel.toString(),
              message: message.toString()
            })
            if (messagesReceived === messagesToReceive) subscriber.complete()
          })
        })
      } catch (e) {
        subscriber.error(err)
      }
    })

    observable.subscribe((ev) => {
      messages[ev.channel] = JSON.parse(ev.message)
      if (messagesReceived === messagesToReceive) {
        expect(messages.transactionReceived.value).toEqual(validBody.value)
        expect(messages.transactionReceived.description).toEqual(validBody.description)
        expect(messages.transactionReceived.payment_method).toEqual(validBody.payment_method)
        expect(messages.transactionReceived.card_number).toEqual(validBody.card_number)
        expect(messages.transactionReceived.card_name).toEqual(validBody.card_name)
        expect(messages.transactionReceived.card_expiration_date).toEqual(validBody.card_expiration_date)
        expect(messages.transactionReceived.card_ccv).toEqual(validBody.card_ccv)
        expect(messages.transactionReceived.client_id).toEqual(clientId)

        expect(messages.transactionPersisted).toHaveProperty('id')
        expect(messages.transactionPersisted).toHaveProperty('createdAt')
        expect(messages.transactionPersisted).toHaveProperty('updatedAt')
        expect(messages.transactionPersisted.value).toEqual(validBody.value.toString())
        expect(messages.transactionPersisted.description).toEqual(validBody.description)
        expect(messages.transactionPersisted.payment_method).toEqual(validBody.payment_method)
        expect(messages.transactionPersisted.card_number).toEqual(validBody.card_number.substring(12))
        expect(messages.transactionPersisted.card_name).toEqual(validBody.card_name)
        expect(messages.transactionPersisted.card_expiration_date).toEqual(validBody.card_expiration_date)
        expect(messages.transactionPersisted.card_ccv).toEqual(validBody.card_ccv)
        expect(messages.transactionPersisted.client_id).toEqual(clientId)

        expect(messages.playablePersisted).toHaveProperty('id')
        expect(messages.playablePersisted).toHaveProperty('createdAt')
        expect(messages.playablePersisted).toHaveProperty('updatedAt')
        expect(messages.playablePersisted.status).toEqual('paid')
        expect(messages.transactionPersisted.value).toEqual(validBody.value.toString())
        expect(messages.playablePersisted).toHaveProperty('payment_date')

        done()
      }
    })

    setTimeout(async () => {
      const result = await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
      expect(result.status).toBe(201)
      expect(result.data).toHaveProperty('message', 'Transaction successfully received')
    }, 2000)
  }, 3000)

  test('Credit Card Transaction shoud return statusCode 201 with correct messages', async (done) => {
    validBody.payment_method = 'credit_card'
    let messagesReceived = 0
    const messagesToReceive = 3
    const messages = {}

    const observable = new Observable(function subscribe (subscriber) {
      try {
        redis.subscribe('transactionReceived', 'transactionPersisted', 'playablePersisted', async (err) => {
          if (err) throw err
          redis.on('messageBuffer', async (channel, message) => {
            messagesReceived++
            subscriber.next({
              channel: channel.toString(),
              message: message.toString()
            })
            if (messagesReceived === messagesToReceive) subscriber.complete()
          })
        })
      } catch (e) {
        subscriber.error(err)
      }
    })

    observable.subscribe((ev) => {
      messages[ev.channel] = JSON.parse(ev.message)
      if (messagesReceived === messagesToReceive) {
        expect(messages.transactionReceived.value).toEqual(validBody.value)
        expect(messages.transactionReceived.description).toEqual(validBody.description)
        expect(messages.transactionReceived.payment_method).toEqual(validBody.payment_method)
        expect(messages.transactionReceived.card_number).toEqual(validBody.card_number)
        expect(messages.transactionReceived.card_name).toEqual(validBody.card_name)
        expect(messages.transactionReceived.card_expiration_date).toEqual(validBody.card_expiration_date)
        expect(messages.transactionReceived.card_ccv).toEqual(validBody.card_ccv)
        expect(messages.transactionReceived.client_id).toEqual(clientId)

        expect(messages.transactionPersisted).toHaveProperty('id')
        expect(messages.transactionPersisted).toHaveProperty('createdAt')
        expect(messages.transactionPersisted).toHaveProperty('updatedAt')
        expect(messages.transactionPersisted.value).toEqual(validBody.value.toString())
        expect(messages.transactionPersisted.description).toEqual(validBody.description)
        expect(messages.transactionPersisted.payment_method).toEqual(validBody.payment_method)
        expect(messages.transactionPersisted.card_number).toEqual(validBody.card_number.substring(12))
        expect(messages.transactionPersisted.card_name).toEqual(validBody.card_name)
        expect(messages.transactionPersisted.card_expiration_date).toEqual(validBody.card_expiration_date)
        expect(messages.transactionPersisted.card_ccv).toEqual(validBody.card_ccv)
        expect(messages.transactionPersisted.client_id).toEqual(clientId)

        expect(messages.playablePersisted).toHaveProperty('id')
        expect(messages.playablePersisted).toHaveProperty('createdAt')
        expect(messages.playablePersisted).toHaveProperty('updatedAt')
        expect(messages.playablePersisted.status).toEqual('waiting_funds')
        expect(messages.transactionPersisted.value).toEqual(validBody.value.toString())
        expect(messages.playablePersisted).toHaveProperty('payment_date')

        done()
      }
    })

    setTimeout(async () => {
      const result = await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
      expect(result.status).toBe(201)
      expect(result.data).toHaveProperty('message', 'Transaction successfully received')
    }, 2000)
  }, 3000)

  it('Transaction list shoud return statusCode 200 and list in body with correct values', async (done) => {
    const transactionList = await axios.get(`${baseUrl}/client/${clientId}/transactions`)
    expect(transactionList.status).toBe(200)
    expect(transactionList.data[0].client_id).toEqual(clientId)
    expect(transactionList.data[0].value).toEqual(validBody.value.toString())
    expect(transactionList.data[0].description).toEqual(validBody.description)
    expect(transactionList.data[0].payment_method).toEqual(validBody.payment_method)
    expect(transactionList.data[0].card_number).toEqual(validBody.card_number.substring(12))
    expect(transactionList.data[0].card_expiration_date).toEqual(validBody.card_expiration_date)
    expect(transactionList.data[0].card_ccv).toEqual(validBody.card_ccv)
    expect(transactionList.data[0].card_name).toEqual(validBody.card_name)
    expect(transactionList.data[0]).toHaveProperty('createdAt')
    done()
  })

  it('Playables shoud return statusCode 200 and data on body', async (done) => {
    const playables = await axios.get(`${baseUrl}/client/${clientId}/playables`)
    expect(playables.status).toBe(200)
    expect(playables.data[0].status === 'paid' || playables.data[0].status === 'waiting_funds').toBe(true)
    expect(playables.data[0]).toHaveProperty('total')
    expect(playables.data[1].status === 'paid' || playables.data[1].status === 'waiting_funds').toBe(true)
    expect(playables.data[1]).toHaveProperty('total')
    done()
  })
})
