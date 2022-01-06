const log4js = require("log4js");
const path = require("path");

const logPath = path.resolve(__dirname, "../../logs");

log4js.configure({
  appenders: {
    defaultLog: {
      type: "dateFile",
      filename: path.join(logPath, "/default.log"),
      pattern: ".yyyy-MM-dd",
      keepFileExt: true,
      maxLogSize: 10485760,
      backups: 3,
      alwaysIncludePattern: true,
    },
    httpLog: {
      type: "dateFile",
      filename: path.join(logPath, "/http.log"),
      pattern: ".yyyy-MM-dd",
      keepFileExt: true,
      alwaysIncludePattern: true,
    },
    errorLog: {
      type: "dateFile",
      filename: path.join(logPath, "/error.log"),
      pattern: ".yyyy-MM-dd",
      keepFileExt: true,
      alwaysIncludePattern: true,
    },
  },
  categories: {
    http: { appenders: ["httpLog"], level: "info" },
    err: { appenders: ["errorLog"], level: "error" },
    default: { appenders: ["defaultLog"], level: "info" },
  },
});

module.exports = {
  httpLogger: log4js.getLogger("http"),
  errorLogger: log4js.getLogger("err"),
  defaultLogger: log4js.getLogger(),
};
