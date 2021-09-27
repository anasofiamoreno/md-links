#!/usr/bin/env node

const mdLinks = require("./scriptfetch.js"); //Importa funcion md-links.
const fnPrintInfo = require("./printinfo.js"); //Importa funcion para mostrar en terminal.
let fs = require("fs"); //Import para poder leer archivos de textoplano en NODE
require("colors");

let option = { validate: false, stats: false }; //Objeto con opciones de validacion.
let noProblems = "ok";

if (process.argv.length >= 2) {
  for (let i = 2; i <= process.argv.length - 1; i++) {
    switch (process.argv[i]) {
      case "--validate":
        option.validate = true;
        break;
      case "--stats":
        option.stats = true;
        break;
      case "--help":
        noProblems = "fail";
        fs.readFile(
          "/Users/anasofia/Documents/GitHub/CDMX011-md-links/README.md",
          "utf-8",
          (err, data) => {
            console.log(err, data);
          }
        );
        break;
      default:
        if (i > 2) {
          noProblems = "fail";
          console.log("Invalid command");
          console.log("Uses --validate or --stats");
          console.log("--help")

        }
    }
  }
  if (noProblems == "ok") {
    mdLinks(process.argv[2], option)
      .then((arrayWithObjects) => {
        fnPrintInfo(arrayWithObjects, option);
      })
      .catch((error) => {
        console.log(error.red);
      });
  }
} else {
  console.log("Error: Enter address and command".red);
}
