const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/image', createProxyMiddleware({
    target: "https://leeminhung.space:8000",
    changeOrigin: true
  }))
}