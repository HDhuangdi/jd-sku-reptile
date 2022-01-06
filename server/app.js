const express = require("express");
const path = require("path");
const fs = require("fs");
const { generateUrl, normalizeData } = require("./platforms");
const { getData } = require("./helpers/http.js");
const { generateComments } = require("./helpers/download");
const { removeDir, generatePathPrefix } = require("./helpers/fs");
const { generateZIP } = require("./helpers/zip");
const { httpLogger, errorLogger } = require("./log4js/config");
const ParamsException = require("./error/ParamsException");

const app = express();

app.get("/api", async (req, res) => {
  console.log(111);
  const startTime = new Date().getTime();
  try {
    checkParams(req.query);
    const result = await getData(
      generateUrl("jd", req.query.sku, req.query.page, req.query.pageSize)
    );

    const { pathPrefix } = generatePathPrefix();
    const targetPath = path.resolve(__dirname, "./comments/" + pathPrefix);
    const zipPath = targetPath + "/comments.zip";

    const data = normalizeData("jd", JSON.parse(result));
    // 去京东获取评论详情,评论图片
    await generateComments(pathPrefix, data);
    // 将详情和图片打包成zip
    await generateZIP(targetPath);

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
    httpLogger.info(`请求:${req.url}, 响应成功, 用时${endTime - startTime}ms`);
  } catch (e) {
    const endTime = new Date().getTime();
    errorLogger.error(
      `请求:${req.url}, 响应失败:${e}, 用时${endTime - startTime}ms`
    );
    res.status(500).send(e.message);
  }
});

function checkParams(query) {
  if (!query.sku) throw new ParamsException("未输入sku!");
  if (!query.page) throw new ParamsException("未输入页码!");
  if (!query.pageSize) throw new ParamsException("未输入页容量!");
}

app.listen(3000);
