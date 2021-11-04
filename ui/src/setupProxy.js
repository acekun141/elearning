const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/image', createProxyMiddleware({
    target: "https://leeminhung.space/api",
    changeOrigin: true
  }))
}