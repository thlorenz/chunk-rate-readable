'use strict';
/*jshint asi: true */

var test = require('tape')

var chunkRate = require('../')
  , numbers = require('../test/fixtures/number-readable');

test('given a stream that emits numbers every 50 ms - total of 6, measuring rate per 100ms in object mode', function (t) {
  
  var numbersStream = numbers({ to: 5, throttle: 50 })

  var rates = chunkRate(numbersStream, { objectMode: true, interval: 100 })

  // throttle causes numbersStream to not emit anything for first 50ms
  var expectedRates = [ 1, 2, 2, 1, 0]
  rates.on('data', check)

  function check (rate) {
    t.equal(rate, expectedRates.shift(), 'rate ' + rate)
    if (!expectedRates.length) { 
      rates.removeAllListeners()
      rates.endSoon()
      t.end()
    }
  }
})
