'use strict';
const k2c = require('koa2-connect');
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function() {
  return async function(ctx, next) {
    if (ctx.request.url.startsWith('/gateway/')) {
      const authorization = ctx.cookies.get('authorization', {
        signed: false,
      });
      const userName = ctx.cookies.get('userName', {
        signed: false,
      });
      await k2c(createProxyMiddleware('/gateway', {
        target: 'http://api.gateway.lowcode',
        changeOrigin: true,
        onProxyReq(proxyReq) {
          proxyReq.removeHeader('x-forwarded-port');
          proxyReq.removeHeader('x-forwarded-host'); // api gateway will read it
          authorization && proxyReq.setHeader('AccessToken', authorization);
          userName && proxyReq.setHeader('UserName', userName);
          proxyReq.setHeader('content-type', 'application/json');
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
      }))(ctx, next);
    } else {
      await next();
    }
  };
};
