function mdLinks(path, options) {
  var contListUrls = 0; //Contador de cada respuestas de servidores.
  let response = []; //Objecto con la respuesta de cada solicitud de servidor
  let numUrlFound = 0; //Array donde se guardan todas las URL encontradas, junto con el texto y numero de linea.
  let allLines = []; //Array con todas las lineas del archivo .md.
  let urlObtained = ""; //String donde se guardan temporalmente laURL de cada linea.
  var textOfUrl = ""; //String donde se guardan temporalmente el texto de cada URL.
  let mdFiles = []; //Array con Lins de archivos .md.
  let contFiles = 0; //Contador de archivos analizados.
  let files = []; //Array con archivos encontrados.

  return new Promise((resolveToIndex, rejectToIndex) => {
    let readline = require("readline"); //Import para funcionamiento leer lineas de archivos de texto plano en NODE
    let fs = require("fs"); //Import para poder leer archivos de textoplano en NODE
    fetch = require("node-fetch-npm"); // Importa Fetch.

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
      fnCheckNoFile("Error no file .MD found");
    } else {
      if (path.includes(".md" || ".txt")) {
        mdFiles.push(path);
      } else {
        fnCheckNoFile("Error file no .MD");
      }
    }
    //console.log("on md-links mdfiles", mdFiles);
    mdFiles.forEach((file) => {
      let numLineOnFile = new Number();
      let fileCreated = [];

      fileCreated = new fs.createReadStream(file).on("error", (err) =>
        rejectToIndex("Error file", err.path, "no found")
      );
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
        fnFindHTML(elementLineToEvaluate)
          .then((htmlfound) => {
            numUrlFound++;
            fnSendReques(htmlfound)
              .then((responseAllFetch) => {
                resolveToIndex(responseAllFetch);
              })
              .catch((ef) => {
                /*Nothing to do*/
              });
          })
          .catch((ef) => {
            /*Nothing to do*/
          });
      });
      if (numUrlFound.length == 0) {
        rejectToIndex("No links found");
      }
    }

    function fnCheckNoFile(errorFile) {
      if (mdFiles.length == 0) {
        rejectToIndex(errorFile);
      }
    }
  });

  function fnSendReques(htmlToSend) {
    return new Promise((resolveFetch) => {
      fetch(htmlToSend.url)
        .then((request) => {
          //console.log("on md-links request", request);
          contListUrls++;

          if (request.url[request.url.length - 1] == "/") {
            request.url = request.url.slice(0, -1);
          }

          if (options.validate) {
            response.push({
              href: htmlToSend.url,
              text: htmlToSend.text,
              file: htmlToSend.file,
              status: request.status,
              ok: "ok",
              line: htmlToSend.line,
              hrefanswer: request.url,
            });
          } else {
            response.push({
              href: request.url,
              text: htmlToSend.text,
              file: htmlToSend.file,
              line: htmlToSend.line,
            });
          }

          process.stdout.clearLine(); //Porcentage de respuestas de servidores.
          process.stdout.cursorTo(0);
          process.stdout.write(
            `Processing ${Math.trunc((contListUrls / numUrlFound) * 100)}%...`
          );
          if (contListUrls == numUrlFound) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log("");
            resolveFetch(response);
          }
        })
        .catch((requestfail) => {
          contListUrls++;
          if (options.validate) {
            response.push({
              href: htmlToSend.url,
              text: htmlToSend.text,
              file: htmlToSend.file,
              status: requestfail.status,
              ok: "fail",
              line: htmlToSend.line,
            });
          } else {
            response.push({
              href: htmlToSend.url,
              text: htmlToSend.text,
              file: htmlToSend.file,
              line: htmlToSend.line,
            });
          }
          if (contListUrls == numUrlFound) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log("");
            console.log("fail");
            resolveFetch(response);
          }
        });
    });
  }
};

function fnFindHTML(elementLineToEvaluate) {
  return new Promise((resolveHTML, rejectHTML) => {
    if (elementLineToEvaluate[0].includes("](http")) {
      urlObtained = Object.values(
        elementLineToEvaluate[0].match(/\]\(https?.*?\)/i)[0]
      )
        .join("")
        .slice(2, -1);

      if (urlObtained[urlObtained.length - 1] == "/") {
        urlObtained = urlObtained.slice(0, -1);
      }

      textOfUrl = Object.values(elementLineToEvaluate[0].match(/\[.*?\]\(/i)[0])
        .join("")
        .slice(1, -2);

      //numUrlFou.push([urlObtained, elementLineToEvaluate[2], textOfUrl]);
      let infoOfLink = new Object();
      infoOfLink = {
        url: urlObtained,
        line: elementLineToEvaluate[2],
        text: textOfUrl,
        file: elementLineToEvaluate[1],
      };

      resolveHTML(infoOfLink);
    }
    rejectHTML("No HTML found");
  });
};


//module.exports.mdLinks = mdLinks;
//module.exports.fnFindHTML = fnFindHTML;

module.exports = {mdLinks, fnFindHTML}
