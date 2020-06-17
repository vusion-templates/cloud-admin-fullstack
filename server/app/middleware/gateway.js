'use strict';
const k2c = require('koa2-connect');
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function() {
  return async function(ctx, next) {
    if (ctx.request.url.startsWith('/gateway/')) {
      await k2c(createProxyMiddleware('/gateway', {
        target: 'http://api.gateway.lowcode',
        changeOrigin: true,
      }))(ctx, next);
    } else {
      await next();
    }
  };
};
