module.exports = function mdLinks (path, options) {
  console.log('path : ' + path);
  console.log('options : ' + options);
  let readline = require('readline');
  let fs  = require('fs');
  let lines = [];
 
  fs.readFile(path, 'utf-8', (err, data) => {fnReadReady(data)});
  

  function fnReadReady(data, error){
 
    //console.log(data);
    //let ss = fs.createReadStream(path);
    //console.log(ss.on());

    let lector = readline.createInterface({
         input: fs.createReadStream(path)
    });

    lector.forEach((line, index) => {
      console.log({ line, index });
    });

    console.log(lines)
    


  



  }



};

