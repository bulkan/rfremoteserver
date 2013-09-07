var fs           = require('fs')
  , RemoteServer = require('../lib/remoteserver');

var TestLibrary = {
  my_example_keyword: {
    impl: function(params, callback) {
      var ret = {
        output: ['array', 'of', 'outputs'].join('\n'),
        return: 'return value of keyword'
      }
      return RemoteServer.pass(ret, callback);
    }
  },

  get_files_in_directory: {
    impl: function(params, callback){
      var self = this;
      var ret = {}
      fs.readdir('.', function(err, files){
        ret.return = err || files;
        if (err) return self.fail(ret, callback);
        return RemoteServer.pass(ret, callback)
      });
    }
  }
};

var server = new RemoteServer(null, [TestLibrary]);
server.start_remote_server();
