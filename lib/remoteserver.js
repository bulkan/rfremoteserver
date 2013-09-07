var xmlrpc = require('xmlrpc');

/**
 * Constructor
 */
var RemoteServer = function(conf, libraries) {
  this.conf = conf;
  this.server = null;

  this.libraries = libraries || [];
};


/**
 * Helper method to PASS the keyword
 *
 * @param ret Object to use as the response
 */
RemoteServer.pass = function(ret, callback) {
  ret = ret || {status: 'PASS'};
  if (!ret.status)
    ret.status = 'PASS';
  return callback(null, ret);
};

/**
 * Helper method to FAIL the keyword
 *
 * @param ret Object to use as the response
 */
RemoteServer.fail = function(ret, callback) {
  ret = ret || {status: 'FAIL'};
  if (!ret.status)
    ret.status = 'FAIL';
  return callback(null, ret);
};

RemoteServer.prototype.get_keyword_arguments = function(params, callback) {
  console.log('get_keyword_arguments');
  return callback(null, ["*args"]);
};

RemoteServer.prototype.get_keyword_documentation = function(params, callback) {
  console.log('get_documententation');
  return callback(null, "Documentation");
};

RemoteServer.prototype.get_keyword_names = function(params, callback) {;
  var names = [];

  this.libraries.forEach(function(library){
    for (name in library) {
      var kw_name = name.replace(/\_/g, ' ');
      names.push(kw_name);
    }
  });

  for (name in this){
    var kw_name = name.replace(/\_/g, ' ');
    names.push(kw_name);
  }

  console.log('get_keyword_names');
  return callback(null, names);
};

RemoteServer.prototype.run_keyword = function(params, callback) {
  var self = this;

  // call the function in our keyword library
  var keyword = params.shift().replace(/\s/g, "_");
  console.log('run_keyword: ' + keyword);

  //TODO: try catch..fail
  self.libraries.forEach(function(library){
    if (keyword in library) return library[keyword](params, callback);
  })
}


/**
 * Helper function to create a callback wrapper around the libary function
 *
 * @param name String the name of function in library
 * @param library Object the object to lookup the property
 */
RemoteServer.prototype.create_callback = function(name, library) {
  return function(err, params, callback) {
    return library[name](params, callback);
  }
};

// Store the non keyword property names
RemoteServer.non_kw = ["server","conf", "close", "start_remote_server", "libraries", "create_callback"];

RemoteServer.prototype.start_remote_server = function() {
  var self = this;

  var conf = self.conf || { host: 'localhost', port: 8270 };

  // dont instanstiate a server if it exists
  var server = self.server = self.server || xmlrpc.createServer(conf);
  console.log("Remote server " + conf.host + " on in port " + conf.port);

  // get the default keywords needed for RF
  for (name in self) {
    if (RemoteServer.non_kw.indexOf(name) == -1) {
      server.on(name, self.create_callback(name, self));
      console.log("Listening for " + name);
    }
  }

  // now for the libraries
  self.libraries.forEach(function(library) {
    for (name in library) {
      server.on(name, self.create_callback(name, library));
      console.log("Listening for " + name);
    }
  })
};


/**
 * Close the server
 */
RemoteServer.prototype.close = function(done) {
  if (this.server) this.server.close(done);
};

module.exports = RemoteServer;
