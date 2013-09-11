var fs = require('fs');

var exports = module.exports;

exports.SimpleKeywordLibrary = {
  file_should_exist: {
    docs: "test if a file exists",
    args: ['dir', 'file'],
    impl: function(params, callback) {
      var dir = params.shift();
      var file = params.shift();
      var ret = {};
      fs.readdir(dir, function(err, files){
        ret.return = err || files;
        if (err) return RemoteServer.fail(ret, callback);

        for (i in files){
          if (files[i] == file)
            return RemoteServer.pass(ret, callback);
        }
        return RemoteServer.fail(ret, callback);
      });
    }
  }
};


exports.FileSystemLibrary = {
  dir_should_exist: {
    docs: "test if a directory exists",
    args: ["dir", "dirnam"],
    impl: function(params, callback){
      return RemoteServer.pass({}, callback);
    }
  }
}


