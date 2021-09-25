#!/usr/bin/env node

const mdLinks = require("./scriptfetch.js");             //Importa funcion md-links.
const fnPrintInfo = require("./printinfo.js");  //Importa funcion para mostrar en terminal.

let option = { validate: false, stats: false };  //Objeto con opciones de validacion.



switch (process.argv[3]) {
  case "--validate":
    option.validate = true;
    if (process.argv[4] == "--stats") {
      option.stats = true;
    }
    mdLinks(process.argv[2], option).then((arrayWithObjects) => {
      fnPrintInfo(arrayWithObjects, option);
    });
    break;
  case "--stats":
    option.stats = true;
    if (process.argv[4] == "--validate") {
      option.validate = true;
    }
    mdLinks(process.argv[2], option).then((arrayWithObjects) => {
      fnPrintInfo(arrayWithObjects, option);
    });
    break;
  case undefined:
    mdLinks(process.argv[2], option).then((arrayWithObjects) => {
      fnPrintInfo(arrayWithObjects, option);
    });
    break;
  default:
    console.log("Comando no valido");
    console.log("Puede Utilizar --Validate o --stats");
}
