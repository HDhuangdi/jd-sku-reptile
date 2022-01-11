const https = require("https");
const axios = require("axios");
const iconv = require("iconv-lite");

function getCommentData(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        headers: {
          Accept: "text/html;charset=GBK",
          Connection: "keep-alive",
          "Accept-Encoding": "gzip, deflate, br",
          "User-Agent": "PostmanRuntime/7.28.1",
        },
        responseType: "arraybuffer",
      })
      .then((res) => {
        const json = JSON.parse(iconv.decode(res.data, "GBK"));
        resolve(json);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function getProductMainPage(sku) {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://item.jd.com/${sku}.html`)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}

function getProductDetailPage(mainSku, sku) {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://cd.jd.com/description/channel?skuId=${sku}&mainSkuId=${mainSku}&charset=utf-8&cdn=2&callback=showdesc`,
        {
          headers: {
            Accept: "text/html;charset=utf-8",
            Connection: "keep-alive",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": "PostmanRuntime/7.28.1",
          },
        }
      )
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
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
      res.on("error", function(err) {
        reject(err);
      });
    });
  });
}

module.exports = {
  getCommentData,
  getPic,
  getProductMainPage,
  getProductDetailPage,
};
