const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const { describe, beforeEach, test, after } = require('node:test')
const User = require('../src/models/user')

const app = require('../src/app')
const api = supertest(app)

describe('Login API tests', async () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'Test@1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
  })
  
  test('login succeeds with correct credentials', async () => {
    const loginDetails = {
      username: 'testuser',
      password: 'Test@1234'
    }

    const response = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    console.log('Login response body:', response.body)
    assert.ok(response.body.token)
    assert.strictEqual(response.body.username, loginDetails.username)
  })

  test.only('login fails with incorrect credentials', async () => {
    const loginDetails = {
      username: 'testuser',
      password: 'WrongPassword'
    }

    const response = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(401)
      .expect('Content-Type', /application\/json/)
      
    assert.strictEqual(response.body.error, 'invalid username or password')
  })

  after(async () => {
    await mongoose.connection.close()
  })
})