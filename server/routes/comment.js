const express = require("express");
const router = express.Router();
const fs = require("fs");
const { generateUrl, normalizeData } = require("../platforms");
const { getCommentData } = require("../helpers/http.js");
const { generateCommentsDir } = require("../helpers/download");
const { removeDir, generatePathPrefix } = require("../helpers/fs");
const { generateZIP } = require("../helpers/zip");
const { httpLogger, errorLogger } = require("../log4js/config");
const ParamsException = require("../error/ParamsException");

router.get("/get", async (req, res) => {
  const startTime = new Date().getTime();
  try {
    checkParams(req.query);
    const result = await getCommentData(
      generateUrl("jd", req.query.sku, req.query.page, req.query.pageSize)
    );

    const { pathPrefix } = generatePathPrefix();
    const data = normalizeData("jd", result);
    // 去京东获取评论详情,评论图片
    const targetPath = await generateCommentsDir(pathPrefix, data);
    // 将详情和图片打包成zip
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
  if (!query.page) throw new ParamsException("未输入页码!");
  if (!query.pageSize) throw new ParamsException("未输入页容量!");
}

module.exports = router;
