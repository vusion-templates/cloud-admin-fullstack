'use strict';
const k2c = require('koa2-connect');
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function() {
  return async function(ctx, next) {
    if (ctx.request.url.startsWith('/gateway/')) {
      await k2c(createProxyMiddleware('/gateway', {
        target: 'http://api.gateway.lowcode',
        changeOrigin: true,
        onProxyReq(proxyReq) {
          proxyReq.removeHeader('x-forwarded-port');
          proxyReq.removeHeader('x-forwarded-host'); // api gateway will read it
          if (ctx.method === 'POST' || ctx.method === 'PUT') {
            const { rawBody, body: requestBody } = ctx.request;
            if (requestBody && rawBody) {
              proxyReq.removeHeader('content-length');
              proxyReq.write(rawBody);
              proxyReq.end();
            }
          }
          return proxyReq;
        },
        onProxyRes(proxyRes) {
          proxyRes.headers['set-cookie'] = 'authorization=' + proxyRes.headers.authorization + '; Path=/; HttpOnly';
          delete proxyRes.headers.authorization;
        },
      }))(ctx, next);
    } else {
      await next();
    }
  };
};
