const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://tomasmercado-001-site9.jtempurl.com',
      secure: false,
      changeOrigin: true,
      logLevel: 'debug',
    })
  );
};
