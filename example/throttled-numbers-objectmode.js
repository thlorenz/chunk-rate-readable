'use strict';

var chunkRate = require('../')
  , numbers = require('../test/fixtures/number-readable');

var numbersStream = numbers({ to: 30, throttle: 200 })

var last = 0;
chunkRate(numbersStream, { objectMode: true })
  .on('data',  function (rate) {
    var indicator = rate === last 
      ? '='
      : rate > last ? '▲' : '▼';
    console.log('%d -> %s', rate, indicator);
    last = rate;
  });
