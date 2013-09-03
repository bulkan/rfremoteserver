var xmlrpc = require('xmlrpc') 
  , RemoteServer = require('../lib/remoteserver');

var options = {host: 'localhost', port: 8270};

describe('RemoteServer', function(){
  var server; 

  before(function(done){
    server = new RemoteServer(options).start_remote_server();
    // need to give the server a litte time to start
    setTimeout(done, 100);
  });

  it('get_keyword_arguments should return correct value', function(done){
    var client = new xmlrpc.createClient(options, false);
    client.methodCall('get_keyword_arguments', null, function(err, value){
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
