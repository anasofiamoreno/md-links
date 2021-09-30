module.exports = function mdLinks(path, options) {
  return new Promise((resolveToIndex, rejectToIndex) => {
    let readline = require("readline"); //Import para funcionamiento leer lineas de archivos de texto plano en NODE
    let fs = require("fs"); //Import para poder leer archivos de textoplano en NODE
    //fetch = require("node-fetch-npm"); // Importa Fetch.

    let listUrls = []; //Array donde se guardan todas las URL encontradas, junto con el texto y numero de linea.
    let contListUrls = 0; //Contador de cada respuestas de servidores.
    let allLines = []; //Array con todas las lineas del archivo .md.
    let response = []; //Objecto con la respuesta de cada solicitud de servidor
    let urlObtained = ""; //String donde se guardan temporalmente laURL de cada linea.
    let textOfUrl = ""; //String donde se guardan temporalmente el texto de cada URL.
    let mdFiles = []; //Array con Lins de archivos .md.
    let contFiles = 0; //Contador de archivos analizados.
    let files = []; //Array con archivos encontrados.

    //console.log("on md-links", path);

    if (path.split(".")[1] == undefined) {
      try {
        files = fs.readdirSync(path);
      } catch (erre) {
        rejectToIndex("Error dir not found");
      }

      files.forEach((file) => {
        if (file.includes(".md" || ".txt")) {
          mdFiles.push(path + "/" + file);
        }
      });
      checkNoFile("Error no file .MD found");
    } else {
      if (path.includes(".md" || ".txt")) {
        mdFiles.push(path);
      } else {
        checkNoFile("Error file no .MD");
      }
    }
    //console.log("on md-links mdfiles", mdFiles);
    mdFiles.forEach((file) => {
      let numLineOnFile = new Number();
      let fileCreated = [];

      fileCreated = new fs.createReadStream(file).on("error", (err) => rejectToIndex("Error file",err.path, "no found"));
      lector = new readline.createInterface({
        input: fileCreated,
      })
        .on("line", (line, i) => {
          numLineOnFile++;
          allLines.push([line, file, numLineOnFile]);
        })
        .on("close", () => {
          contFiles++;
          if (contFiles == mdFiles.length) {
            fnValite(allLines);
          }
        });
    });

    function fnValite(linesToEvaluate) {
      //console.log("on md-links lines to evaluate", linesToEvaluate);
      linesToEvaluate.map((elementLineToEvaluate) => {
        if (elementLineToEvaluate[0].includes("](http")) {
          //urlObtained = elementLineToEvaluate[0].slice(elementLineToEvaluate[0].indexOf("](")+2,elementLineToEvaluate[0].indexOf(")"))
          urlObtained = Object.values(
            elementLineToEvaluate[0].match(/\]\(https?.*?\)/i)[0]
          )
            .join("")
            .slice(2, -1);

          if (urlObtained[urlObtained.length - 1] == "/") {
            urlObtained = urlObtained.slice(0, -1);
          }

          //textOfUrl = elementLineToEvaluate[0].slice(elementLineToEvaluate[0].indexOf("[") + 1, elementLineToEvaluate[0].indexOf("]("));
          textOfUrl = Object.values(
            elementLineToEvaluate[0].match(/\[.*?\]\(/i)[0]
          )
            .join("")
            .slice(1, -2);
          listUrls.push([urlObtained, elementLineToEvaluate[2], textOfUrl]);
          let infoOfLink = new Object();
          infoOfLink = {
            url: urlObtained,
            line: elementLineToEvaluate[2],
            text: textOfUrl,
            file: elementLineToEvaluate[1],
          };

          fetch(urlObtained)
            .then((request) => {
              //console.log("on md-links request", request);
              contListUrls++;
              let statusIsValid = new String();
              if (request.status >= 200 && request.status <= 399) {
                statusIsValid = "ok";
              } else {
                statusIsValid = "fail";
              }

              if (request.url[request.url.length - 1] == "/") {
                request.url = request.url.slice(0, -1);
              }

              if (options.validate) {
                response.push({
                  href: infoOfLink.url,
                  text: infoOfLink.text,
                  file: infoOfLink.file,
                  status: request.status,
                  ok: statusIsValid,
                  line: infoOfLink.line,
                  hrefanswer: request.url,
                });
              } else {
                response.push({
                  href: request.url,
                  text: infoOfLink.text,
                  file: infoOfLink.file,
                  line: infoOfLink.line,
                });
              }

              process.stdout.clearLine(); //Porcentage de respuestas de servidores.
              process.stdout.cursorTo(0);
              process.stdout.write(
                `Processing ${Math.trunc(
                  (contListUrls / listUrls.length) * 100
                )}%...`
              );

              if (contListUrls == listUrls.length) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                console.log("");
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
                  ok: "fail",
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
                console.log("");
                resolveToIndex(response);
              }
            });
        }
      });
      if (listUrls.length == 0) {
        rejectToIndex("No links found");
      }
    }

    function checkNoFile(errorFile) {
      if (mdFiles == 0) {
        rejectToIndex(errorFile);
      }
    }
  });
};
