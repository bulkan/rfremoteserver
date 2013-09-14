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
    client.methodCall('run_keyword', ['get error value'], function(err, value){
      if (err) return done(err);
      value.should.have.property('error');
      value.status.should.be.equal('FAIL');
      done();
    });
  });

  it('traceback should be set', function(done){
    client.methodCall('run_keyword', ['throw an error'], function(err, value){
      if (err) return done(err);
      value.should.have.property('error');
      value.should.have.property('traceback');
      value.status.should.be.equal('FAIL');
      value.traceback.should.not.be.empty;
      done();
    });
  });

  it('try to run a nonexisting keyword', function(done){
    client.methodCall('run_keyword', ['get something'], function(err, value){
      if (err) return done(err)
      decodeURIComponent(value.traceback).should.include('Error: keyword get_something not found');
      value.should.have.property('error');
      value.should.have.property('traceback');
      value.status.should.be.equal('FAIL');
      value.traceback.should.not.be.empty;
      done();
    });
  });
});
