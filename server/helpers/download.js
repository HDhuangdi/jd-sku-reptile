const { getPic } = require("./http");
const { writeFile } = require("./fs");
const path = require("path");

function downloadContent(pathPrefix, commentList) {
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

function downloadPic(pathPrefix, commentList) {
  return new Promise((resolve, reject) => {
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

    Promise.all(
      imgUrls.map((url) => {
        return getPic(url);
      })
    )
      .then((resArr) => {
        resArr.forEach((res, index) => {
          const splitArr = imgUrls[index].split("/");
          const picName = splitArr[splitArr.length - 1];
          writeFile(
            path.resolve(
              __dirname,
              `../comments/${pathPrefix}/图片/${picName}`
            ),
            res,
            {
              encoding: "binary",
            },
            (err) => {
              if (err) {
                reject(err);
              }
            }
          );
        });
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

async function generateComments(pathPrefix, commentList) {
  await Promise.all([
    downloadContent(pathPrefix, commentList),
    downloadPic(pathPrefix, commentList),
  ]);

  return path.resolve(__dirname, `../comments/${pathPrefix}`);
}

module.exports = { generateComments, downloadContent, downloadPic };
