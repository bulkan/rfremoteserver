var xmlrpc = require('xmlrpc')
  , winston = require('winston');

if (!process.env.DEBUG) winston.remove(winston.transports.Console);

/**
 * Constructor
 */
var RemoteServer = function(conf, libraries) {
  var self = this;

  self.conf = conf;
  self.server = null;

  self.libraries = libraries || [];

  self.kwlist = {};

  self.libraries.forEach(function(library){
    for (name in library)
      self.kwlist[name] = library;
  });
};

// Store the non keyword property names
RemoteServer.non_kw = ["server","conf", "close", "start_remote_server", "libraries", "create_callback", "kwlist"];

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

RemoteServer.prototype._get_keyword = function(name){
  return name.replace(/\_/g, ' ');
}

RemoteServer.prototype.get_keyword_arguments = function(params, callback) {
  var self = this;
  var name = params.shift();
  var kw = name.replace(/\ /g, '_');
  var lib = self.kwlist[kw];

  winston.info('get_keyword_arguments:');

  // default to vary args
  var args = ['*args'];

  if (lib) args = lib[kw].args
  return callback(null, args);
};

RemoteServer.prototype.get_keyword_documentation = function(params, callback) {
  winston.info('get_documententation');
  var self = this;
  var name = params.shift();
  var kw = name.replace(/\ /g, '_');
  var lib = self.kwlist[kw];
  var doc = "";
  if (lib) doc = lib[kw].docs
  return callback(null, doc);
};

RemoteServer.prototype.get_keyword_names = function(params, callback) {;
  var self = this;
  winston.info('get_keyword_names');

  if (self.names) return callback(null, self.names);

  self.names = [];

  this.libraries.forEach(function(library){
    for (name in library) {
      self.names.push(self._get_keyword(name));
    }
  });

  for (name in this){
    self.names.push(self._get_keyword(name));
  }

  return callback(null, self.names);
};

RemoteServer.prototype.run_keyword = function(params, callback) {
  var self = this;

  // call the function in our keyword library
  var keyword = params.shift().replace(/\s/g, "_");
  winston.info('run_keyword: ' + keyword);

  function _ret(error, value) {
    if (error){
      value.traceback = error.stack.toString();
      value.status = 'FAIL';
      value.error = error.toString();
    }
    return callback(null, value);
  }

  if (keyword in self.kwlist) {
    var library = self.kwlist[keyword];

    try {
      return library[keyword].impl(params, _ret);
    } catch(e) {
        return _ret(e, {});
    }
  }
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


RemoteServer.prototype.start_remote_server = function() {
  var self = this;

  var conf = self.conf || { host: 'localhost', port: 8270 };

  // dont instanstiate a server if it exists
  var server = self.server = self.server || xmlrpc.createServer(conf);
  winston.info("Remote server " + conf.host + " on in port " + conf.port);

  // get the default keywords needed for RF
  for (name in self) {
    if (RemoteServer.non_kw.indexOf(name) == -1 && name[0] != '_') {
      server.on(name, self.create_callback(name, self));
      winston.info("Listening for " + name);
    }
  }

  // now for the libraries
  for (name in self.kwlist) {
    server.on(name, self.create_callback(name, self.kwlist[name]));
    winston.info("Listening for " + name);
  }
};


/**
 * Close the server
 */
RemoteServer.prototype.close = function(done) {
  if (this.server) this.server.close(done);
};

module.exports = RemoteServer;
