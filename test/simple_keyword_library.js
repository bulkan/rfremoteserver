var xmlrpc       = require('xmlrpc')
  , util         = require('util')
  , fs           = require('fs')
  , RemoteServer = require('../lib/remoteserver');

var options = {host: 'localhost', port: 8270};


var SimpleKeywordLibrary = function(conf) {
  var self = this;
  self.conf = conf;
  
  self.file_should_exist = function(dir, file, callback) {
    fs.readdir(dir, function(err, files){
      ret.return = err || files;
      if (err) return self.fail(ret, callback);

      if (file in files)
        return self.pass(ret, callback);
      return self.fail(ret, callback);
    });
  };
};

util.inherits(SimpleKeywordLibrary, RemoteServer);


describe('SimpleKeywordLibrary', function(){
  var server = null;

  before(function(done){
    server = new SimpleKeywordLibrary(options);
    server.start_remote_server();
    done();
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
});
