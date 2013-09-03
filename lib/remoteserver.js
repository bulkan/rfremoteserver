var xmlrpc = require('xmlrpc');

/**
 * Constructor
 */
var RemoteServer = function(library) {
  // TODO: do i need to pass in the library still as I am using inheritance ?
  this.library = library;
  this.server = null;
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
  console.log(ret);
  return callback(null, ret);
};

/**
 * Helper method to FAIL the keyword
 *
 * @param ret Object to use as the response
 */
RemoteServer.prototype.fail = function(callback) {
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
    console.log(kw_name);
    names.push(kw_name);
  }
  console.log('get_keyword_names');
  return callback(null, names);
};

RemoteServer.prototype.run_keyword = function(params, callback) {
  // call the function in our keyword library
  console.log('run_keyword: ' + params[0]);
  return this[params[0].replace(/\s/g, "_")](params, callback)
}

RemoteServer.prototype.create_callback = function(name) {
  var remote = this;
  return function(err, params, callback) {
    return remote[name](params, callback);
  }
};

RemoteServer.prototype.start_remote_server = function(conf) {
  var self = this;

  var conf = conf || { host: 'localhost', port: 8270 };

  // dont instanstiate a server if it exists
  var server = self.server || xmlrpc.createServer(conf);
  console.log("Remote server " + conf.host + " on in port " + conf.port);

  for (name in self) {
    if (!(name in ["fail", "pass", "start_remote_server", "library", "create_callback"])) {
        server.on(name, self.create_callback(name));
        console.log("Listening for " + name);
    }
  }
};

module.exports = RemoteServer;
