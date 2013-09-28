'use strict';
/*jshint asi: true */

var test = require('tape')

var chunkRate = require('../')
  , numbers = require('../test/fixtures/number-readable');

test('given a stream that emits numbers every 100 ms - total of 6, measuring rate per 200ms', function (t) {
  
  var numbersStream = numbers({ to: 5, throttle: 100 })

  var rates = chunkRate(numbersStream, { interval: 200 })

  // throttle causes numbersStream to not emit anything for first 100ms
  var expectedRates = [ 1, 2, 2, 1, 0 ].map(function (n) { return '' + n })
  rates.on('data', check)

  function check (rate) {
    t.equal(rate.toString(), expectedRates.shift(), 'rate ' + rate)
    if (!expectedRates.length) { 
      rates.removeAllListeners()
      rates.endSoon()
      t.end()
    }
  }
})
