const fs = require("fs");
const path = require("path");
const { dateFormat } = require("./date");

function generatePathPrefix() {
  const now = new Date();
  let Y = dateFormat("YYYY", now);
  let M = dateFormat("mm", now);
  let D = dateFormat("dd", now);
  let H = dateFormat("HH", now);
  let m = dateFormat("MM", now);
  let s = dateFormat("SS", now);

  return {
    Y,
    M,
    D,
    H,
    m,
    s,
    pathPrefix: `${M}-${D}/${H}:${m}:${s}`,
  };
}

function removeDir(pathname) {
  const files = fs.readdirSync(pathname);
  files.forEach((file) => {
    const curPathname = pathname + "/" + file;
    if (fs.statSync(curPathname).isDirectory()) {
      removeDir(curPathname);
    } else {
      fs.unlinkSync(curPathname);
    }
  });
  fs.rmdirSync(pathname);
}

function removeLastDayDir(month, day) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(path.resolve(__dirname, `../comments`))) {
      resolve();
      return;
    }
    fs.readdir(path.resolve(__dirname, `../comments`), (err, files) => {
      if (err) {
        reject(err);
      } else {
        const now = `${month}-${day}`;
        files.forEach((filename) => {
          if (filename !== now) {
            removeDir(path.resolve(__dirname, `../comments/` + filename));
          }
        });
        resolve();
      }
    });
  });
}

function checkPath(path) {
  let pathArray = path.split("/");

  const reducer = (acc, cur) => {
    let curPath;
    if (!acc) {
      curPath = acc + cur;
    } else {
      curPath = acc + "/" + cur;
      const exists = fs.existsSync(curPath);
      if (!exists && cur.indexOf(".") === -1) {
        // 确定是个没有被创建的文件夹
        fs.mkdirSync(curPath);
      }
    }
    return curPath;
  };
  pathArray.reduce(reducer, "/");
}

function writeFileSync(path, content, options) {
  checkPath(path);
  return fs.writeFileSync(path, content, options);
}

function writeFile(path, content, options, cb) {
  checkPath(path);
  return fs.writeFile(path, content, options, cb);
}

module.exports = {
  removeDir,
  removeLastDayDir,
  generatePathPrefix,
  writeFileSync,
  writeFile,
};
