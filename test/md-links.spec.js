const mdLinks = require("../scriptfetch.js"); //Importa funcion md-links.
//const fnPrintInfo = require("../printinfo.js"); //Importa funcion para mostrar en terminal.
//const filetest = require("../testlinks.md"); //Importa funcion md-links.
const mocksResponse = require("./mocks.js"); //Importa funcion md-links.
const mockfetch = require("../test/mockfetch.js"); //Importa funcion md-links.
let colors = require("colors");
const mockResponse = require("./mocks.js");

const option = { validate: false, stats: false }; //Objeto con opciones de validacion.
const dirTest = "/Users/anasofia/Documents/GitHub/CDMX011-md-links/diferentslinks.md";
global.fetch() = mockfetch;




test("Validar archivo .md con mock", () => {
    fetch("http").then(() => {console.log("entro");})
    //await mdLinks(dirTest, option).resolves.toBe(mockResponse);

    return expect(mdLinks(dirTest, option)).resolves.toBe(mockResponse);
  /*
  .then((result) => {
    console.log("0n test", result);
    expect(result).toBe(mockResponse);
  }).catch((error) => {console.log("Error----------------", error)});
  */
});
