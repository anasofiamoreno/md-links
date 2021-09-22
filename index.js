#!/usr/bin/env node
let mdLinks = require('./script');
let option = { validate: false, stats: false };
let uniques = [];

switch(process.argv[3]){
    case '--validate': option.validate = true ;
      if(process.argv[4]  == '--stats'){
        option.stats= true;
      }             
    break;
    case '--stats': option.stats= true ;
      if(process.argv[4]  == '--validate'){
        option.validate= true;
      }
    break;
    default: console.log('comando no valido');
}

mdLinks(process.argv[2], option)
  .then( (message) => {
      //console.log(message);
      if(option.stats){
        process.stdout.write("Total " + '\033[32m' + message.length + '\033[0m' + '\n');
        uniques = message.map((element) => {return element.href.toString()});
        uniques = new Set(uniques)
        console.log("Unique ",Array.from(uniques).length);
        if(option.validate){
          uniques = message.filter((element) => {if(element.ok == "fail"){return element.href}});
          process.stdout.write("Broken " + '\033[31m' +uniques.length + '\033[0m');
        }
      }
      else
      {
        if(option.validate){
          message.forEach(element => {
            process.stdout.write('\x1b[36m' + element.file + " " + '\x1b[0m' + "\x1b[4m" + element.href  + " " + "\x1b[0m" + "\x1b[37m" + element.ok +  " " + "\x1b[33m" + element.status + " " + '\x1b[0m' + element.text + '\n');
          });
        }
        else{
          message.forEach(element => {
            console.log(element.file, element.href, element.text);
          });
        }
      }
      
  });


