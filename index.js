#!/usr/bin/env node

var program = require('commander');
var npm = require('npm');
var getStdin = require('get-stdin');

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
  var uselib = require(p.require);
  var path = p.execute.split(".");
  var usefunction = uselib;
  for(var i=0;i<path.length;i++){
    usefunction = usefunction[path[i]];
  }
  var result = usefunction.apply(null, arguments);
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
  .option('--ijson', 'Input argument is well formatted json that should be parsed as object')
  .option('--ojson', 'Output result is object that should be well formatted json')
  .parse(process.argv);



getStdin().then(function(str) {

  if(program.install){
    npm.load({ 'save': true, 'loglevel': 'silent' }, function (err) {
      if(err) console.error(err);

      npm.commands.install([program.install], function (err, data) {
        if(err) return console.error(err);
        executeProgram(program, str);
      });
    });
  }
  else {
    executeProgram(program, str);
  }
});
