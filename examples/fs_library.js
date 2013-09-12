var fs           = require('fs')
  , RemoteServer = require('../lib/remoteserver');

var TestLibrary = {
  my_example_keyword: {
    docs: "a sample keyword",
    args: ["*args"],
    impl: function(params, callback) {
      var ret = {
        output: ['array', 'of', 'outputs'].join('\n'),
        return: 'return value of keyword'
      }
      return RemoteServer.pass(ret, callback);
    }
  },

  get_files_in_directory: {
    docs: "returns the files in a directory",
    args: ["dir"],
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

var server = new RemoteServer({host: 'localhost', port:8270}, [TestLibrary]);
server.start_remote_server();
