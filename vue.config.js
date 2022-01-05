const isDev = process.env.NODE_ENV === "development";

module.exports = {
  publicPath: isDev ? "/" : "/daidai/",
  devServer: {
    disableHostCheck: true,
    open: false,
    host: "127.0.0.1",
    proxy: {
      "/daidaiapi": {
        // target: "http://ruaruapig.xyz/daidaiapi",
        target: "http://localhost:3000",
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf("html") !== -1) {
            return "/index.html";
          }
        }, //只代理API
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/daidaiapi": "",
        },
      },
    },
  },
};
