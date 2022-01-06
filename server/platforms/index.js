function generateUrl(platform, sku, page, pageSize) {
  let fn;
  switch (platform) {
    case "jd":
      fn = require("./jd").generateJDUrl;
      break;
    default:
      fn = require("./jd").generateJDUrl;
  }
  return fn(sku, page, pageSize);
}

function normalizeData(platform, data) {
  let fn;
  switch (platform) {
    case "jd":
      fn = require("./jd").normalizeData;
      break;
    default:
      fn = require("./jd").normalizeData;
  }
  return fn(data);
}

module.exports = { generateUrl, normalizeData };
