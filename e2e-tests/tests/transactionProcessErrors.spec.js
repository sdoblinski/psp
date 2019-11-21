const axios = require('axios')

const baseUrl = 'http://localhost:8080'

const clientId = '1'

let validBody

describe('Scenario: Transaction Process Errors', () => {
  beforeEach(() => {
    validBody = {
      value: 2.99,
      description: 'Água Mineral 1L',
      payment_method: 'debit_card',
      card_number: '5370388222537383',
      card_name: 'John Doe',
      card_expiration_date: '0422',
      card_ccv: '999'
    }
  })

  it('Transaction with value lesser than 0.1 should return status code 400 with error message in body', async (done) => {
    validBody.value = 0
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.value" must be larger than or equal to 0.1')
      done()
    }
  })

  it('Transaction with value greater than 9999999999 should return status code 400 with error message in body', async (done) => {
    validBody.value = 99999999999
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.value" must be less than or equal to 9999999999')
      done()
    }
  })

  it('Transaction with no value should return status code 400 with error message in body', async (done) => {
    delete validBody.value
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.value" is required')
      done()
    }
  })

  it('Transaction with description longer than 50 should return status code 400 with error message in body', async (done) => {
    validBody.description = 'descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription'
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.description" length must be less than or equal to 50 characters long')
      done()
    }
  })

  it('Transaction with no description should return status code 400 with error message in body', async (done) => {
    delete validBody.description
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.description" is required')
      done()
    }
  })

  it('Transaction with wrong payment method should return status code 400 with error message in body', async (done) => {
    validBody.payment_method = 'cheque'
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.payment_method" must be one of [debit_card, credit_card]')
      done()
    }
  })

  it('Transaction with no payment method should return status code 400 with error message in body', async (done) => {
    delete validBody.payment_method
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.payment_method" is required')
      done()
    }
  })

  it('Transaction with wrong card number should return status code 400 with error message in body', async (done) => {
    validBody.card_number = '999999'
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.card_number" length must be 16 characters long')
      done()
    }
  })

  it('Transaction with wrong card number should return status code 400 with error message in body', async (done) => {
    delete validBody.card_number
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.card_number" is required')
      done()
    }
  })

  it('Transaction with card name longer than 30 should return status code 400 with error message in body', async (done) => {
    validBody.card_name = 'card_namecard_namecard_namecard_namecard_namecard_namecard_namecard_namecard_name'
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.card_name" length must be less than or equal to 30 characters long')
      done()
    }
  })

  it('Transaction with no card name should return status code 400 with error message in body', async (done) => {
    delete validBody.card_name
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.card_name" is required')
      done()
    }
  })

  it('Transaction with card expiration date longer than should 4 return status code 400 with error message in body', async (done) => {
    validBody.card_expiration_date = '1111111111'
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.card_expiration_date" length must be 4 characters long')
      done()
    }
  })

  it('Transaction with no card expiration date should return status code 400 with error message in body', async (done) => {
    delete validBody.card_expiration_date
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.card_expiration_date" is required')
      done()
    }
  })

  it('Transaction with card ccv longer than should 3 return status code 400 with error message in body', async (done) => {
    validBody.card_ccv = '1111111111'
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.card_ccv" length must be 3 characters long')
      done()
    }
  })

  it('Transaction with no card cvv should return status code 400 with error message in body', async (done) => {
    delete validBody.card_ccv
    try {
      await axios.post(`${baseUrl}/client/${clientId}/transactions`, validBody)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"body.card_ccv" is required')
      done()
    }
  })

})
