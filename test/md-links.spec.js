const mdLinks = require("../scriptfetch.js"); //Importa funcion md-links.
//const fnPrintInfo = require("../printinfo.js"); //Importa funcion para mostrar en terminal.
//const filetest = require("../testlinks.md"); //Importa funcion md-links.
const mocks = require("./mocks.js"); //Importa funcion md-links.
let colors = require("colors");

let option = { validate: false, stats: false }; //Objeto con opciones de validacion.
const filetest = "/Users/anasofia/Documents/GitHub/CDMX011-md-links/test/onelink.md";
//global.firebase = firebases();

console.log(mocks);

test("returna Array", async() => {
  await mdLinks(filetest, option).then((result) => {
    expect(typeof result).toBe("array");
  });
});

test("Validar archivo .md con servidor real", async() => {
  await mdLinks(filetest, option).then((result) => {
    expect(result).toBe(mocks);
  });
});
