const { test, describe } = require('node:test')
const assert = require('node:assert')

const average = require('../src/utils/for_testing').average

describe('average', () => {
  test.only('of one value is the value itself', () => {
    assert.strictEqual(average([1]), 1)
  })

  test.only('of many is calculated right', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  test.only('of empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})