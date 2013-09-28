# chunk-rate-readable [![build status](https://secure.travis-ci.org/thlorenz/chunk-rate-readable.png)](http://travis-ci.org/thlorenz/chunk-rate-readable)

[![testling badge](https://ci.testling.com/thlorenz/chunks-over-time-writable.png)](https://ci.testling.com/thlorenz/chunks-over-time-writable)

Measures the rate at which a given stream emits data chunks and streams the result.

```js
var chunkRate = require('chunk-rate-readable')
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
```

![example output](https://github.com/thlorenz/chunk-rate-readable/raw/master/assets/chunk-rate-demo.gif)

## Installation

    npm install chunk-rate-readable

## API

###*function ChunkRateReadable (stream[, opts])*

Creates a readable stream that will emit how many chunks the given stream emitted during the given interval.

@name ChunkRateReadable
@function
**params:**

- stream *ReadableStream* whose chunk rate is measured
- opts *Object* with the following properties:
  - objectMode {Boolean} if true rate is emitted as actual numbers, otherwise as buffers
  - interval {Number} at which to measure the rate (default: rate/500ms)

**returns:**

*ReadableStream* that will emit updates about the chunk rate of the given stream.

###*chunkRateReadable.endSoon*

Call this in case you want to tell the rate stream to end.
Useful for testing and/or when you want to end your debugging session and allow the program to exit.

## Similar Modules

- [speed-meter](https://github.com/CrowdProcess/speed-meter) measures the number of emitted bytes (vs. number of chunks) over a given time period

## License

MIT
