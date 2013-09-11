var xmlrpc       = require('xmlrpc')
  , fs           = require('fs')
  , RemoteServer = require('../lib/remoteserver')
  , libraries            = require('./keyword_libraries')
  , SimpleKeywordLibrary = libraries.SimpleKeywordLibrary;

var options = {host: 'localhost', port: 4242};

describe('Multiple Keyword Libraries', function(){
  var server = null;

  before(function(done){
    server = new RemoteServer(options, [SimpleKeywordLibrary]);
    server.start_remote_server();
    done();
  });

  after(function(done){
    server.close(done);
  });

});
