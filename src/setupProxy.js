const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080', // 你的本地后端地址
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // 将请求路径中的 /api 替换为空，即移除 /api
      },
    })
  );
};