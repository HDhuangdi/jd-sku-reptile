function generateJDUrl(sku, page, pageSize) {
  return `https://club.jd.com/comment/productPageComments.action?productId=${sku}&score=0&sortType=5&page=${page}&pageSize=${pageSize}&isShadowSku=0&fold=1`;
}

function normalizeData(data) {
  let result = [];
  result = data.comments;
  return result;
}

module.exports = { generateJDUrl, normalizeData };
