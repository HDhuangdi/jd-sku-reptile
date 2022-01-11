function getMainSkuId(html) {
  const result = html.match(/mainSkuId=(\d+)/);
  return result[1];
}

module.exports = {
  getMainSkuId,
};
