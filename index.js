var util         = require('util')
  , RemoteServer = require('./lib/remoteserver');

var TestLibrary = function() {
  var self = this;

  self.my_example_keyword = function(params, callback) {
    var ret = {
      output: ['array', 'of', 'outputs'].join('\n'),
      return: 'return value of keyword'
    }
    return this.pass(ret, callback);
  }
};

util.inherits(TestLibrary, RemoteServer);

var server = new TestLibrary();
server.start_remote_server();
