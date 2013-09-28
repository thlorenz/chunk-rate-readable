'use strict';

var chunkRate = require('../')
  , numbers = require('../test/fixtures/number-readable');

var numbersStream = numbers({ to: 30, throttle: 200 })

chunkRate(numbersStream).pipe(process.stdout);
