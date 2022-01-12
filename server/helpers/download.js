const cheerio = require("cheerio");
const { getPic } = require("./http");
const { writeFile, genFileName } = require("./fs");
const path = require("path");

async function downloadPic(srcList, dest) {
  try {
    const resArr = await Promise.all(srcList.map((url) => getPic(url)));
    const promiseArr = resArr.map((res, index) => {
      const splitArr = srcList[index].split("/");
      const extName = "." + splitArr[splitArr.length - 1].split(".")[1];
      return writeFile(
        path.resolve(__dirname, `${dest}/${genFileName(index, extName)}`),
        res,
        {
          encoding: "binary",
        }
      );
    });

    await Promise.all(promiseArr);
  } catch (e) {
    throw e;
  }
}

async function downloadCommentContent(pathPrefix, commentList) {
  let commentsContent = "";

  commentList.forEach((comment) => {
    commentsContent += comment.content + "\n\n\n\n\n\n";
  });
  await writeFile(
    path.resolve(__dirname, `../comments/${pathPrefix}/文字评论/content.txt`),
    commentsContent,
    {
      encoding: "utf-8",
    }
  );
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
    const suffix = node.attribs.src.split("jfs")[1];
    srcList.push("https://img30.360buyimg.com/imgzone/jfs" + suffix);
  }

  await downloadPic(srcList, `../details/${pathPrefix}/图片/主图`);
  return path.resolve(__dirname, `../details/${pathPrefix}`);
}

async function downloadDetailsPic(pathPrefix, html) {
  const res = html.match(/\/\/[\w\d\.\/]*\.jpg/g);
  const srcList = res.map((url) => {
    let temp = url.split("//");
    if (temp[0]) {
      //has protocol
      return url;
    } else {
      return "https:" + url;
    }
  });

  await downloadPic(srcList, `../details/${pathPrefix}/图片/详情`);
  return path.resolve(__dirname, `../details/${pathPrefix}`);
}

module.exports = {
  generateCommentsDir,
  downloadMainPic,
  downloadDetailsPic,
};
