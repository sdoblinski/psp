const axios = require('axios')

const baseUrl = 'http://localhost:8080'

let clientId

describe('Scenario: Playables Errors', () => {
  beforeEach(() => {
    clientId = 1
  })

  it('Playables with client id longer than 30 should return status code 400 with error message in body', async (done) => {
    clientId = '11111111111111111111111111111111111111111111111111'
    try {
      await axios.get(`${baseUrl}/client/${clientId}/playables`)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"clientId" length must be less than or equal to 30 characters long')
      done()
    }
  })

  it('Playables with malformed client id should return status code 400 with error message in body', async (done) => {
    clientId = 'clientId'
    try {
      await axios.get(`${baseUrl}/client/${clientId}/playables`)
    } catch (e) {
      expect(e.response.status).toBe(400)
      expect(e.response.data).toHaveProperty('message', '"clientId" with value "clientId" fails to match the required pattern: /^\\d+$/')
      done()
    }
  })
})
