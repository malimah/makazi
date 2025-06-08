// Mock implementation of tty for web environment
module.exports = {
  isatty: function() {
    return false;
  },
  WriteStream: function() {},
  ReadStream: function() {}
}; 