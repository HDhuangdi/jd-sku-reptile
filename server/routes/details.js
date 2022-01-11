const express = require("express");
const router = express.Router();
const fs = require("fs");
const { getProductMainPage, getProductDetailPage } = require("../helpers/http");
const { removeDir, generatePathPrefix } = require("../helpers/fs");
const { downloadMainPic, downloadDetailsPic } = require("../helpers/download");
const { generateZIP } = require("../helpers/zip");
const { httpLogger, errorLogger } = require("../log4js/config");

router.get("/get", async (req, res) => {
  const startTime = new Date().getTime();
  try {
    checkParams(req.query);
    const resArr = await Promise.all([
      getProductMainPage(req.query.sku),
      getProductDetailPage(req.query.mainSku, req.query.sku),
    ]);
    const { pathPrefix } = generatePathPrefix();

    const detailHTML = JSON.parse(resArr[1].match(/\{[\s\S]*\}/)[0]).content;
    const [targetPath] = await Promise.all([
      // 获取主图
      downloadMainPic(pathPrefix, resArr[0]),
      // 获取详情图
      downloadDetailsPic(pathPrefix, detailHTML),
    ]);
    // 将详情和图片打包成zip;
    const zipPath = await generateZIP(targetPath, req.query.sku + ".zip");

    const rs = fs.createReadStream(zipPath);
    const size = fs.statSync(zipPath).size;

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=comments.zip",
      "Content-Length": size,
    });

    // 以文件流的形式发送给前端
    rs.pipe(res);
    rs.on("end", () => {
      // 流结束后删除zip文件
      removeDir(targetPath);
    });

    const endTime = new Date().getTime();
    httpLogger.info(
      `请求:${req.url}, 响应成功, 用时${endTime - startTime}ms, ip:${req
        .headers["x-real-ip"] || req.headers["x-forwarded-for"]}`
    );
  } catch (e) {
    const endTime = new Date().getTime();
    errorLogger.error(
      `请求:${req.url}, 响应失败:${e}, 用时${endTime - startTime}ms`
    );
    res.status(500).send(e);
    throw e;
  }
});

function checkParams(query) {
  if (!query.sku) throw new ParamsException("未输入sku!");
}

module.exports = router;
