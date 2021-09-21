module.exports = function mdLinks (path, options) {
  console.log('path : ' + path);
  console.log('options : ' + options);
  let readline = require('readline');
  let fs  = require('fs');
  let listUrls = [];
  let numLinea = 1;
 
  fs.readFile(path, 'utf-8', (err, data) => {fnReadReady(data)});
  

  function fnReadReady(data, error){
 
    //console.log(data);
    //let ss = fs.createReadStream(path);
    //console.log(ss.on());

    let lector = readline.createInterface({
      input: fs.createReadStream(path),
      completer: fnterminado(),
    });

    lector.on('line', linea => {
      if(linea.includes('http')){
        console.log('linea ' + numLinea, linea);
        const ss = linea.slice(linea.indexOf('http')).split(')')
        console.log('Url:',ss[0]);
        listUrls.push(ss[0]);
        console.log("");
      }
     numLinea++;
    });

    
    function fnterminado(){
      console.log("terminado");
    }
  }

};

