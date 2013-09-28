'use strict';

var chunkRate = require('../')
  , numbers = require('../test/fixtures/number-readable');

var numbersStream = numbers({ to: 20, throttle: 200 })

var last = 0;
chunkRate(numbersStream, { objectMode: true, interval: 500 })
  .on('data',  function (rate) {
    var indicator = rate === last 
      ? '='
      : rate > last ? '▲' : '▼';
    console.log(' %s  %d/500ms', indicator, rate);
    last = rate;
  });
