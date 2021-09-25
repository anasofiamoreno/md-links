module.exports = function mdLinks(path, options) {
  return new Promise((resolveToIndex, rejectToIndex) => {
    
    fetch('https://google.com')
    .then(res => res.text())
    .then(text => console.log(text))
  resolveToIndex('Hola')

  })
}
