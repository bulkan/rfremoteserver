var xmlrpc               = require('xmlrpc')
  , RemoteServer         = require('../lib/remoteserver')
  , libraries            = require('./keyword_libraries')
  , SimpleKeywordLibrary = libraries.SimpleKeywordLibrary;

var options = {host: 'localhost', port: 4242};


describe('Simple keyword libraries', function(){
  var server = null;

  before(function(done){
    server = new RemoteServer(options, [SimpleKeywordLibrary]);
    server.start_remote_server();
    done();
  });

  after(function(done){
    server.close(done);
  });

  it('starts on specified port number', function(done){
    server.should.have.property('conf');
    server.conf.should.have.property('port');
    server.conf.port.should.be.equal(options.port);
    done();
  });

  it('should have the new keyword', function(done){
    var client = new xmlrpc.createClient(options, false);

    client.methodCall('get_keyword_names', null, function(err, value){
      if (err) return done(err);

      value.should.not.be.empty;
      value.should.include('file should exist');
      return done();
    });
  });

  it('should be able to run keywords', function(done){
    var client = new xmlrpc.createClient(options, false);
    client.methodCall('run_keyword', ['file should exist', '.', 'package.json'], function(err, value){
      if (err) return done(err);
      value.should.have.property('return');
      value.should.have.property('status');
      value.return.should.include('lib');
      value.status.should.be.equal('PASS');
      return done();
    });
  });

  it('get_keyword_arguments should return correct value', function(done){
    var client = new xmlrpc.createClient(options, false);
    client.methodCall('get_keyword_arguments', ['file should exist'], function(err, value){
      if (err) return done(err);
      value.should.not.be.empty;
      value.should.include('dir');
      value.should.include('file');
      return done();
    });
  });

  it('get_keyword_documentation should return correct value', function(done){
    var client = new xmlrpc.createClient(options, false);
    client.methodCall('get_keyword_documentation', ['file should exist'], function(err, value){
      if (err) return done(err);
      value.should.not.be.empty;
      value.should.equal(libraries.SimpleKeywordLibrary.file_should_exist.docs);
      return done();
    });
  });
});
