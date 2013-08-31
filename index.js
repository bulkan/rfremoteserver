var util         = require('util')
  , RemoteServer = require('./lib/remoteserver');

var TestLibrary = function() {
  var self = this;

  self.documentation = {
  
  };

  self.my_example_keyword = function(params, callback) {
    console.log('my_example_keyword');
    return this.pass(callback);
  }
};

util.inherits(TestLibrary, RemoteServer);

var server = new TestLibrary();
server.start_remote_server();
