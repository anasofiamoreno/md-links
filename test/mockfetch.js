module.export = function mockfetch(path,options) {
  return new Promise((resolve, reject) => {
      console.log("path on mockfetch", path)
    resolve(console.log("------------------fetch---------------------"));
  });
}


