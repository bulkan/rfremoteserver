var xmlrpc               = require('xmlrpc')
  , fs                   = require('fs')
  , RemoteServer         = require('../lib/remoteserver')
  , libraries            = require('./keyword_libraries')
  , SimpleKeywordLibrary = libraries.SimpleKeywordLibrary
  , FileSystemLibrary    = libraries.FileSystemLibrary;

var options = {host: 'localhost', port: 4242};

describe('Multiple Keyword Libraries', function(){
  var server = null;
  var client = null;

  before(function(done){
    server = new RemoteServer(options, [SimpleKeywordLibrary, FileSystemLibrary]);
    server.start_remote_server();
    // need to give the server a litte time to start
    setTimeout(function() { 
      client = new xmlrpc.createClient(options, false);
      done();
    }, 100);
  });

  after(function(done){
    server.close(done);
  });

  it('should be able to be load all libraries passed', function(done){
    client.methodCall('get_keyword_names', null, function(err, value){
      if (err) return done(err);

      value.should.not.be.empty;
      value.should.include('get keyword documentation');
      value.should.include('get keyword names');
      value.should.include('get keyword arguments');
      value.should.include('dir should exist');
      value.should.include('run keyword');
      done();
    });
  });

  it('should be able to run keyword', function(done){
    var client = new xmlrpc.createClient(options, false);
    client.methodCall('run_keyword', ['dir should exist', '.', 'test'], function(err, value){
      if (err) return done(err);
      value.should.have.property('status');
      value.status.should.be.equal('PASS');
      return done();
    });
  });

});
