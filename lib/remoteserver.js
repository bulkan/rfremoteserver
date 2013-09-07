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
RemoteServer.prototype.pass = function(ret, callback) {
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
RemoteServer.prototype.fail = function(ret, callback) {
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
  for (name in this){
    var kw_name = name.replace(/\_/g, ' ');
    names.push(kw_name);
  }
  console.log('get_keyword_names');
  return callback(null, names);
};

RemoteServer.prototype.run_keyword = function(params, callback) {
  // call the function in our keyword library
  var keyword = params.shift();
  console.log('run_keyword: ' + keyword);

  //TODO: try catch..fail
  return this[keyword.replace(/\s/g, "_")](params, callback)
}

RemoteServer.prototype.create_callback = function(name, library) {
  return function(err, params, callback) {
    return library[name](params, callback);
  }
};

RemoteServer.prototype.start_remote_server = function() {
  var self = this;

  var conf = self.conf || { host: 'localhost', port: 8270 };

  // dont instanstiate a server if it exists
  var server = self.server || xmlrpc.createServer(conf);
  console.log("Remote server " + conf.host + " on in port " + conf.port);

  for (name in self) {
    if (!(name in ["fail", "pass", "start_remote_server", "library", "create_callback"])) {
      server.on(name, self.create_callback(name, self));
      console.log("Listening for " + name);
    }
  }

  for (library in self.libraries) {
    for (name in library) {
      server.on(name, self.create_callback(name, library));
      console.log("Listening for " + name);
    }
  }
};

module.exports = RemoteServer;
