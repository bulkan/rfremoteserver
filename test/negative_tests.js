var xmlrpc               = require('xmlrpc')
  , RemoteServer         = require('../lib/remoteserver')
  , libraries            = require('./keyword_libraries')
  , AwfulKeywordLibrary  = libraries.AwfulKeywordLibrary;

var options = {host: 'localhost', port: 4242};


describe('Broken & Bad Keywords', function(){
  var server = null;
  var client = null;

  before(function(done){
    server = new RemoteServer(options, [AwfulKeywordLibrary]);
    server.start_remote_server();
    setTimeout(function() { 
      client = new xmlrpc.createClient(options, false);
      done();
    }, 100);
  });

  after(function(done){
    server.close(done);
  });

  it('status should be automatically be set to FAIL', function(done){
    client.methodCall('run_keyword', ['throw an error'], function(err, value){
      if (err) return done(err);
      value.should.have.property('error');
      done();
    });
  });
});
