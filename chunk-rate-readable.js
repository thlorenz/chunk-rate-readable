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

proto._init = function (stream) {
  var self = this;

  stream.on('data', ondata);
  function ondata () {
    self._count++;
  }
}

proto._read = function () {
  var self = this;

  function push() {

    self.push(self._objectMode ? self._count : '' + self._count);
    self._count = 0;
  }

  setTimeout(push, this._interval);    
};
