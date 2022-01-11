const cheerio = require("cheerio");
const { getPic } = require("./http");
const { writeFile } = require("./fs");
const path = require("path");

async function downloadPic(srcList, dest) {
  try {
    const resArr = await Promise.all(srcList.map((url) => getPic(url)));
    const promiseArr = resArr.map((res, index) => {
      const splitArr = srcList[index].split("/");
      const picName = splitArr[splitArr.length - 1];
      return writeFile(path.resolve(__dirname, `${dest}/${picName}`), res, {
        encoding: "binary",
      });
    });
    await Promise.all(promiseArr);
  } catch (e) {
    throw e;
  }
}

function downloadCommentContent(pathPrefix, commentList) {
  let commentsContent = "";
  return new Promise((resolve, reject) => {
    commentList.forEach((comment) => {
      commentsContent += comment.content + "\n\n\n\n\n\n";
    });
    writeFile(
      path.resolve(__dirname, `../comments/${pathPrefix}/文字评论/content.txt`),
      commentsContent,
      {
        encoding: "utf-8",
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

async function downloadCommentPic(pathPrefix, commentList) {
  let imgUrls = [];
  commentList.forEach((comment) => {
    if (comment.images && comment.images.length) {
      comment.images.forEach((image) => {
        let imgUrl =
          "https:" +
          image.imgUrl
            .replace("/n0/", "/shaidan/")
            .replace(/(\/s\w+_jfs)/, "/s2000x2000_jfs");
        imgUrls.push(imgUrl);
      });
    }
  });

  await downloadPic(imgUrls, `../comments/${pathPrefix}/图片`);
}

async function generateCommentsDir(pathPrefix, commentList) {
  await Promise.all([
    downloadCommentContent(pathPrefix, commentList),
    downloadCommentPic(pathPrefix, commentList),
  ]);
  return path.resolve(__dirname, `../comments/${pathPrefix}`);
}

async function downloadMainPic(pathPrefix, html) {
  const $ = cheerio.load(html);
  const imgNodeList = $("#spec-list img");
  const srcList = [];
  for (const node of imgNodeList) {
    srcList.push("https:" + node.attribs.src.replace("54x54", "1000x1000"));
  }

  await downloadPic(srcList, `../details/${pathPrefix}/图片`);
  return path.resolve(__dirname, `../details/${pathPrefix}`);
}

async function downloadDetailsPic(pathPrefix, html) {
  const $ = cheerio.load(html);
  const imgNodeList = $("img");
  const srcList = [];
  for (const node of imgNodeList) {
    srcList.push(node.attribs["data-lazyload"]);
  }
  await downloadPic(srcList, `../details/${pathPrefix}/图片`);
  return path.resolve(__dirname, `../details/${pathPrefix}`);
}

module.exports = {
  generateCommentsDir,
  downloadMainPic,
  downloadDetailsPic,
};
