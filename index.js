var util         = require('util')
  , fs           = require('fs')
  , RemoteServer = require('./lib/remoteserver');

var TestLibrary = function() {
  var self = this;

  self.my_example_keyword = function(params, callback) {
    var ret = {
      output: ['array', 'of', 'outputs'].join('\n'),
      return: 'return value of keyword'
    }
    return this.pass(ret, callback);
  };

  self.get_files_in_directory = function(params, callback){
    var self = this;
    var ret = {}
    fs.readdir('.', function(err, files){
      ret.return = err || files;
      if (err) return self.fail(ret, callback);
      return self.pass(ret, callback)
    });
  };
};

util.inherits(TestLibrary, RemoteServer);

var server = new TestLibrary();
server.start_remote_server();
