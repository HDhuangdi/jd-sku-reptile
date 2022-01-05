const https = require("https");

function getData(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = [];
        res.on("data", (chunk) => {
          data.push(chunk);
        });
        res.on("end", () => {
          var iconv = require("iconv-lite");
          var decodedBody = iconv.decode(Buffer.concat(data), "GBK");
          resolve(decodedBody);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

function getPic(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      res.setEncoding("binary");
      let imgData = "";
      res.on("data", (chunk) => (imgData += chunk));
      res.on("end", () => {
        resolve(imgData);
      });
      res.on("error", function (err) {
        reject(err);
      });
    });
  });
}

module.exports = { getData, getPic };
