const isDev = process.env.NODE_ENV === "development";

module.exports = {
  publicPath: "/",
  devServer: {
    disableHostCheck: true,
    open: false,
    host: "localhost",
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        }, //只代理API
        secure: false,
        changeOrigin: true,
        // pathRewrite: {
        //   "^/daidaiapi": "",
        // },
      },
    },
  },
};
