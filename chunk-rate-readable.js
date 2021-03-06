'use strict';

var stream = require('stream');
var util = require('util');

var Readable = stream.Readable;

module.exports = ChunkRateReadable;

util.inherits(ChunkRateReadable, Readable);

/**
 * Creates a readable stream that will emit how many chunks the given stream emitted during the given interval.
 * 
 * @name ChunkRateReadable
 * @function
 * @param stream {ReadableStream} whose chunk rate is measured
 * @param opts {Object} with the following properties:
 *  - objectMode {Boolean} if true rate is emitted as actual numbers, otherwise as buffers
 *  - interval {Number} at which to measure the rate (default: rate/500ms)
 * @return {ReadableStream} that will emit updates about the chunk rate of the given stream.
 */
function ChunkRateReadable (stream, opts) {
  if (!(this instanceof ChunkRateReadable)) return new ChunkRateReadable(stream, opts);
  Readable.call(this, opts);

  opts = opts || {};
  this._interval = opts.interval || 500; // 1/2 s
  this._objectMode = opts.objectMode;

  this._count = 0;
  this._init(stream);
}
var proto = ChunkRateReadable.prototype;

/**
 * Call this in case you want to tell the rate stream to end.
 * Useful for testing and/or when you want to end your debugging session and allow the program to exit.
 * 
 * @name endSoon
 * @function
 */
proto.endSoon = function () {
  this._ending = true;
}

proto._init = function (stream) {
  var self = this;

  stream.on('data', ondata);
  function ondata () {
    self._count++;
  }
}

proto._read = function () {
  var self = this;

  if (self._ending) return self.push(null);

  function push() {

    self.push(self._objectMode ? self._count : '' + self._count);
    self._count = 0;
  }

  setTimeout(push, this._interval);    
}
