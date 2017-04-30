const readline = require('readline');

const DEFAULT_FRAMES = '|/-\\';
const DEFAULT_DELAY = 100;

function Loader(stream, message) {
  this.stream = stream;
  this.message = message || '';
  this.frames = DEFAULT_FRAMES;
  this.delay = DEFAULT_DELAY;
  this.currentFrame = 0;
}

function getLine(loader) {
  const frameNum = loader.currentFrame % loader.frames.length;
  return loader.frames[frameNum] + ' ' + loader.message;
}

function clearLine(loader) {
  readline.clearLine(loader.stream, 0);
  readline.cursorTo(loader.stream, 0);
}

function update(loader) {
  clearLine(loader);
  loader.stream.write(getLine(loader));
  loader.currentFrame++
}

Loader.prototype.start = function () {
  if (this.interval) {
    return;
  }

  this.currentFrame = 0;
  this.interval = setInterval(() => update(this), this.delay);
}

Loader.prototype.stop = function () {
  if (this.interval) {
    clearInterval(this.interval);
    this.interval = null;
    clearLine(this);
  }
}

module.exports = Loader;
