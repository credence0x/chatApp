
// var assert = require('assert')
const assert = require('chai').assert
// Or use the code that uses destructuring:
// const {assert} = require('chai')
const {expect} = require("chai")
var expected, current
before(() => {
    expected = ['a', 'b', 'c']
})
describe('String#split', () => {
    beforeEach(() => {
        current = 'a,b,c'.split(',')
    })
    it('should return an array', () => {
        assert(Array.isArray(current))
    })
    it('should return the same array', () => {
        assert.equal(expected.length, current.length, 'arrays have equal length')

        for (let i = 0; i < expected.length; i++) {

            assert.equal(expected[i], current[i], `i element is equal`)

        }
    })
    it('should return the same array 2', () => {
        expect(expected.length).to.equal(current.length)
        for (let i = 0; i < expected.length; i++) {
            expect(expected[i]).equal(current[i])
        }
    })
})
// • assert(expressions, message): Throws an error if the expression
// is false
// • assert.fail(actual, expected, [message], [operator]): 
// Throws an error with values of actual, expected, and operator
// • assert.ok(object, [message]): Throws an error when the object 
// is not double equal (==) to true—a.k.a., truthy (0, and an empty string 
// is false in JavaScript/Node.js)
// • assert.notOk(object, [message]): Throws an error when the 
// object is falsy, i.e., false, 0 (zero), "" (empty string), null, undefined, 
// or NaN
// • assert.equal(actual, expected, [message]): Throws an error 
// when actual is not double equal (==) to expected
// • assert.notEqual(actual, expected, [message]): Throws 
// an error when actual is double equal (==)—in other words, not 
// unequal (!=)—to expected
// • .strictEqual(actual, expected, [message]): Throws an error 
// when objects are not triple equal (===)