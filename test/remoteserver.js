var xmlrpc = require('xmlrpc') 
  , RemoteServer = require('../lib/remoteserver');


var options = {host: 'localhost', port: 8270};


describe('RemoteServer', function(){
  var server; 
  it('a test', function(done){
    server = new RemoteServer(options).start_remote_server();

    setTimeout(function () {
      var client = new xmlrpc.createClient(options, false);
      client.methodCall('get_keyword_arguments', null, function(err, value){
        if (err) return done(err);
        console.log(err);
        done();
      });
    }, 500);
  });
});
