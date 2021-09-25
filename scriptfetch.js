#!/usr/bin/env node
module.exports = function mdLinks(path, options) {
  return new Promise((resolveToIndex, rejectToIndex) => {
    let readline = require("readline"); //Import para funcionamiento leer lineas de archivos de texto plano en NODE
    let fs = require("fs"); //Import para poder leer archivos de textoplano en NODE
    fetch = require('node-fetch-npm');
  


  
    let listUrls = []; //Array donde se guardan todas las URL encontradas, junto con el texto y numero de linea.
    let contListUrls = 0; //Contador de cada respuestas de servidores.
    let allLines = []; //Array con todas las lineas del archivo .md.
    let response = []; //Objecto con la respuesta de cada solicitud de servidor
    let urlObtained = ""; //String donde se guardan temporalmente laURL de cada linea.
    let textOfUrl = ""; //String donde se guardan temporalmente el texto de cada URL.
    let mdFiles = [];
    let contFiles = 0;

    if (!path.includes(".md")) {
      let files = fs.readdirSync(path);
      files.forEach((file) => {
        if (file.includes(".md" || ".txt")) {
          mdFiles.push(path +  '/' + file);
          
        }
      });
    }
    else{
      mdFiles.push(path); 
    }

  

    mdFiles.forEach((file) => {
      let numLineOnFile = new Number();
      lector = new readline.createInterface({
        
        input: new fs.createReadStream(file),
      }).on("line", (line,i) => {
        
        numLineOnFile++;
        allLines.push([line,file,numLineOnFile]);
      })
      .on("close", () => {
      contFiles++
      if(contFiles == mdFiles.length){
        fnValite(allLines, numLineOnFile)
      }
      });
    });

    
     

    

    function fnValite(linesToEvaluate, numLineOnFile) {
        linesToEvaluate.map((elementLineToEvaluate) => {
          
          if (elementLineToEvaluate[0].includes("https://")) {
            urlObtained = elementLineToEvaluate[0]
              .slice(elementLineToEvaluate[0].indexOf("https://"))
              .split(")");
            textOfUrl = elementLineToEvaluate[0]
              .slice(elementLineToEvaluate.indexOf("[") + 1)
              .split("]");
            listUrls.push([urlObtained[0],elementLineToEvaluate[2], textOfUrl[0]]);
            let infoOfLink = new Object();
            infoOfLink = {
              url: urlObtained[0],
              line: elementLineToEvaluate[2],
              text: textOfUrl[0],
              file: elementLineToEvaluate[1]
            };

            fetch(urlObtained[0]).then((request) => {



                contListUrls++;
                let statusIsValid = new String();
                if (request.status >= 200 && request.status <= 399) {
                  statusIsValid = "ok";
                } else {
                  statusIsValid = "fail";
                }

                if (options.validate) {
                  response.push({
                    href: request.url,
                    text: infoOfLink.text,
                    file: infoOfLink.file,
                    status: request.status,
                    ok: statusIsValid,
                    line: infoOfLink.line,
                  });
                } else {
                  response.push({
                    href: request.url,
                    text: infoOfLink.text,
                    file: infoOfLink.file,
                    line: infoOfLink.line,
                  });
                }

               
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`Processing ${Math.trunc((contListUrls/listUrls.length)*100)}%...`);

                if (contListUrls == listUrls.length) {
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  console.log('');
                  resolveToIndex(response);
                }
            


            })
            .catch(() => {
              contListUrls++;
              if (options.validate) {
                response.push({
                  href: infoOfLink.url,
                  text: infoOfLink.text,
                  file: infoOfLink.file,
                  status: 0,
                  ok: 'fail',
                  line: infoOfLink.line,
                });
              } else {
                response.push({
                  href: infoOfLink.url,
                  text: infoOfLink.text,
                  file: infoOfLink.file,
                  line: infoOfLink.line,
                });
              }

                if (contListUrls == listUrls.length) {
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  console.log('');
                  resolveToIndex(response);
                }
            })
            
          }
        });
      
    }

  });
};
