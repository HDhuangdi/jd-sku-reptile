const fs = require("fs");
const path = require("path");
const JsZip = require("jszip");

function generateZIPFolder(zip, pathname) {
  const files = fs.readdirSync(path.resolve(__dirname, pathname));

  files.forEach((file) => {
    const curPathname = pathname + "/" + file;
    if (fs.statSync(curPathname).isDirectory()) {
      generateZIPFolder(zip, curPathname);
    } else {
      const ext = path.extname(file);
      let binary = ext === ".jpg" || ext === ".png";

      const rs = fs.createReadStream(curPathname);
      rs.setEncoding(binary ? "binary" : "utf-8");

      zip.file(file, rs, { binary });
    }
  });
}

function generateZIP(pathname, zipname) {
  return new Promise((resolve, reject) => {
    const targetPathname = pathname + "/" + zipname;
    if (fs.existsSync(targetPathname)) {
      fs.unlinkSync(targetPathname);
    }

    const zip = new JsZip();

    generateZIPFolder(zip, pathname);
    zip
      .generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9,
        },
      })
      .then((res) => {
        try {
          fs.writeFileSync(targetPathname, res, "utf-8");
          resolve(targetPathname);
        } catch (e) {
          reject(e);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = { generateZIP };
