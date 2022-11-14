const { createProxyMiddleware } = require('http-proxy-middleware')
require('dotenv').config()

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api_external',{
      target: process.env.SERVICE_API_EXTERNAL,
      changeOrigin: true,
      logLevel: 'debug',
      followRedirects: false,
      onError: (err, req, res) => console.log(err),
      pathRewrite: {
        '^/api_external': '',
      },
    }),
    createProxyMiddleware('/api', {
      target: process.env.SERVICE_API,
      changeOrigin: true,
      logLevel: 'debug',
      followRedirects: false,
      onError: (err, req, res) => console.log(err),
      pathRewrite: {
        '^/api': '',
      },
    }),
    
  )
}
// pathRewrite: (path) => path.replace('/api','/')
