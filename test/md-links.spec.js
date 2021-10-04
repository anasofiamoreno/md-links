const scriptfetch = require("../scriptfetch.js"); //Importa funcion md-links.
const mocksResponse = require("./mocks.js"); //Importa funcion md-links.
const mockfetch = require("./mockfetch.js"); //Importa funcion md-links.
let colors = require("colors");

const option = { validate: false, stats: false }; //Objeto con opciones de validacion.
const dirTest = "/Users/anasofia/Documents/GitHub/md-links/test/onelink.md";
jest.mock('node-fetch-npm');

global.fetch = mockfetch.mockfetch;
global.fnFindHTML = scriptfetch.fnFindHTML
global.mdLinks = scriptfetch.mdLinks


test("Validar archivo .md con mock", () => {

  mdLinks(dirTest, option)
    .then((arrayWith) => {
      console.log("This array", arrayWith);
      console.log("Correct", mocksResponse);
      //expect(arrayWith).toBe(mocksResponse);
    })
    .catch((error) => {
      console.log("Error ----- ", error);
    });
    
});

test("Function fnFindHTML(), encontrar html en linea de texto", () =>{
  fnFindHTML(["[Google](https://www.google.com)"]).then((responseHTML) => {
    expect(responseHTML.url).toBe('https://www.google.com');
  });

});

test("Function fetch(), response of fetch", () =>{
  mockfetch.mockfetch("https://www.google.com").then((responseFetch) => {
    expect(responseFetch.url + " " + responseFetch.status).toBe("https://www.google.com 200");
  });

});




