'use strict';

var stream = require('stream');
var util = require('util');

var Readable = stream.Readable;

module.exports = ChunkRateReadable;

util.inherits(ChunkRateReadable, Readable);

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
 * Call this in case you want to tell the state stream to end.
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
