robotremoteserver.js
====================

Robot Framewore Remote Server written in Node.js, loosely based on https://github.com/mkorpela/RoboZombie/blob/master/robozombie.coffee

Installation
============

Will upload to `npm` soonish

Usage
=====

Create a `class` and that inherits from `RemoteServer`, e.g;

```nodejs
var TestLibrary = function() {
  var self = this;

  self.my_example_keyword = function(params, callback) {
    // do testy stuff here then either pass the keyword using this.pass or this.fail
    return this.pass(callback);
  }
};

util.inherits(TestLibrary, RemoteServer);

var server = new TestLibrary();
server.start_remote_server();
```

Example test case file for Robot Framework to use the above remote keyword library

```text
*** Settings ***
Library    Remote    http://localhost:${PORT}

*** Variables ***
${PORT}    8270

*** Test Cases ***

Test Keyword
    ${ret}=   My Example Keyword
    Log    ${ret}
```
