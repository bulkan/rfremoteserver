var xmlrpc       = require('xmlrpc')
  , RemoteServer = require('../lib/remoteserver');

var options = {host: 'localhost', port: 4242};

describe('RemoteServer', function(){
  var server = null;
  var client = null;

  before(function(done){
    server = new RemoteServer(options);
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

  it('starts on specified port number', function(done){
    server.should.have.property('conf');
    server.conf.should.have.property('port');
    server.conf.port.should.be.equal(options.port);
    done();
  });

  it('get_keyword_arguments should return correct value', function(done){
    var client = new xmlrpc.createClient(options, false);
    client.methodCall('get_keyword_arguments', ['get keyword arguments'], function(err, value){
      if (err) return done(err);
      // correct value is that all keywords accept varying arguments
      value[0].should.equal('*args');
      return done();
    });
  });

  it('get_keyword_name should return the base class list of keyword names', function(done){
    var client = new xmlrpc.createClient(options, false);
    client.methodCall('get_keyword_names', null, function(err, value){
      if (err) return done(err);

      value.should.not.be.empty;
      value.should.include('get keyword documentation');
      value.should.include('get keyword names');
      value.should.include('get keyword arguments');
      value.should.include('run keyword');
      return done();
    });
  });
});
