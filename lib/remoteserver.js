var xmlrpc = require('xmlrpc');

var RemoteServer = function(library) {
  this.library = library;
  this.server = null;
};


RemoteServer.prototype.get_keyword_arguments = function(params, callback) {
  return callback(null, ["*args"]);
};

RemoteServer.prototype.get_keyword_documentation = function(params, callback) {
  return callback(null, "Doqumantsione");
};

RemoteServer.prototype.get_keyword_names = function(params, callback) {;
  var names = [];
  for (name in this.library){
    if name[0].toUpperCase() == name[0]
      names.push(name.replace(/\_/g, ' '));
  }
  return names;
};

RemoteServer.prototype.run_keyword = function(params, callback) {
  // call the function in our keyword library
  return this.library[params[0].replace(/\s/g, "_")](params, callback)
}

RemoteServer.prototype.create_callback = function(name) {
  var remote = this;
  return function(err, params, callback) {
    return remote[name](params, callback);
  }
};

RemoteServer.prototype.start_remote_server = function(conf) {
  var self = this;

  var conf = conf || { host: 'localhost', port: 1337 };

  var server = self.server || xmlrpc.createServer(conf);

  for (name in self) {
    if name not in ["start_remote_server", "library", "create_callback"] {
        console.log("Listening for " + name);
        server.on(name, self.create_callback(name));
        console.log("Remote server on in port 1337");
    }
  }
};

