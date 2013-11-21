[![Build Status](https://travis-ci.org/bulkan/rfremoteserver.png?branch=master)](https://travis-ci.org/bulkan/rfremoteserver)

rfremoteserver
===============

[![NPM](https://nodei.co/npm/rfremoteserver.png)](https://nodei.co/npm/rfremoteserver/) [![NPM](https://nodei.co/npm-dl/rfremoteserver.png?months=6)](https://nodei.co/npm/rfremoteserver/)

[Robot Framework](http://robotframework.googlecode.com/hg/) Remote Server written in Node.js, loosely based on https://github.com/mkorpela/RoboZombie and https://github.com/comick/node-robotremoteserver

Installation
============

`npm install rfremoteserver`


Usage
=====

Create an Object like the following and pass it to an instance of `RemoteServer`. 

```javascript
var RemoteServer = require('rfremoteserver');

var SimpleKeywordLibrary = {
  get_files_in_directory: {
    docs: "returns files in a directory",
    args: ["dir"],
    impl: function(params, callback){
      var self = this;
      var ret = {}
      fs.readdir('.', function(err, files){
        ret.return = err || files;
        if (err) return self.fail(ret, callback);
        return RemoteServer.pass(ret, callback)
      });
    }
  }
};

var server = new RemoteServer({host: "localhost", port: 8270}, [SimpleKeywordLibrary]);
server.start_remote_server();
```



In the above example, the library is just a JavaScript object with each property being another JavaScript object. These properties are the keywords. 
They are also Objects and need to have three properties. 

* `docs`: String contain the keyword documentation
* `args`: Array of the arguments that keyword accepts. use ["\*args"] if your keyword accepts more than one argument.
* `impl`: The actual keyword function. This function is what gets bound as an xmlrpc method callback hence its args are always `params` & `callback`. This function will need to call the callback function with an object that contains the following properties

        { 
          return: 'a return falue',
          status: 'PASS',    // or FAIL
          output: 'stdout'
        }

  There is two helper functions on RemoteServer `pass` and `fail` that set the `status` property

RemoteServer instance option Object should contain the following properties

* host    : hostname
* port    : port number to start listening on
* timeout : the amount of time before the server forcibly timesout the keyword

Example test case file for Robot Framework to use the above remote keyword library

```
*** Variables ***
${PORT}    8270


*** Settings ***
Library    Remote    http://localhost:${PORT}

*** Test Cases ***

Test Keyword
    ${ret}=   File Should Exist  ${CURDIR}  testcases.txt
    Should Contain   ${files}  test
```
