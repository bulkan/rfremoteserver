var xmlrpc = require('xmlrpc');

var RemoteServer = function(library) {
  this.library = library;
  this.server = null;
};

RemoteServer.prototype.get_keyword_arguments = function(params, callback) {
  console.log('get_keyword_arguments');
  return callback(null, ["*args"]);
};

RemoteServer.prototype.pass = function(ret, callback) {
  ret = {status: 'PASS'} || ret;
  if (!ret.status)
    ret.status = 'PASS';
  return callback(null, ret);
};

RemoteServer.prototype.fail = function(callback) {
  ret = {status: 'FAIL'} || ret;
  if (!ret.status)
    ret.status = 'FAIL';
  return callback(null, ret);
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

  var server = self.server || xmlrpc.createServer(conf);
  console.log("Remote server " + conf.host + " on in port " + conf.port);

  for (name in self) {
    if (["fail", "pass", "start_remote_server", "library", "create_callback"].indexOf(name) == -1) {
        server.on(name, self.create_callback(name));
        console.log("Listening for " + name);
    }
  }
};

module.exports = RemoteServer;
