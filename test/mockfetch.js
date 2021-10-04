function mockfetch (path,options) {
  return new Promise((resolve, reject) => {
      const request = {
        url: path,
        status: 200,
      }
    resolve(request);
  });
}



module.exports = {mockfetch}



