#!/usr/bin/env node

var program = require('commander');
var npm = require('npm');
var getStdin = require('get-stdin');
var request = require('request');
var _eval = require('eval');
var async = require('async');
var fs = require('fs');

var executeProgram = function(p, str){
  var arguments = p.args;
  if(str){
    var index = arguments.indexOf("-");
    var str = str.replace(/(\r\n|\n|\r)/gm,"");
    if(p.ijson){
      str = JSON.parse(str);
    }
    if(index>-1){
      arguments[index] = str;
    }
    else{
      arguments.push(str);
    }
  }
  var result;
  if(p.inline){
    result = _eval(p.inline,"dummy",{args:arguments}, true)(arguments);
  }
  else {
    var uselib = require(p.require);
    var path = p.execute.split(".");
    var usefunction = uselib;
    for(var i=0;i<path.length;i++){
      usefunction = usefunction[path[i]];
    }
    result = usefunction.apply(null, arguments);
  }
  if(p.ojson){
    result = JSON.stringify(result);
  }
  console.log(result);
};

program
  .arguments('[arguments...]')
  .option('-r, --require <package>', 'The package to require')
  .option('-e, --execute <function>', 'The function to execute')
  .option('-i, --install <package>', 'The package to install locally beforehand')
  .option('-u, --use <url>', 'the url of the snippet to use')
  .option('-p, --path <path>', 'the file to run')
  .option('--ijson', 'Input argument is well formatted json that should be parsed as object')
  .option('--ojson', 'Output result is object that should be well formatted json')
  .parse(process.argv);


getStdin().then(function(str) {

  async.series({
    inline: function(callback) {
      if(program.use){
        request.get(program.use, function(error, response, body){
          callback(error, body);
        });
      }
      else if(program.path){
        fs.readFile(program.path, callback);
      }
      else {
        callback(null);
      }
    },
    install: function(callback) {
      if(program.install){
        npm.load({ 'save': true, 'loglevel': 'silent' }, function (err) {
          if(err) callback(err);
          npm.commands.install([program.install], callback);
        });
      }
      else {
        callback(null);
      }
    }
  }, function (err, result) {
    if(err){
      console.error(err);
    }
    else{
      program.inline = result.inline;
      executeProgram(program, str);
    }
  });
});
