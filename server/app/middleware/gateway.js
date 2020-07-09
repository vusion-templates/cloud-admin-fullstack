'use strict';
const k2c = require('koa2-connect');
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(options) {
  const DomainName = options.DomainName;
  const PROJECT_ID = options.PROJECT_ID;
  const TENANT_ID = options.TENANT_ID;
  const onProxyReq = function(proxyReq, req) {
    proxyReq.removeHeader('x-forwarded-port');
    proxyReq.removeHeader('x-forwarded-host'); // api gateway will read it
    const authorization = req.cookies.get('authorization', {
      signed: false,
    });
    const userName = req.cookies.get('userName', {
      signed: false,
    });
    authorization && proxyReq.setHeader('authorization', authorization);
    userName && proxyReq.setHeader('UserName', userName);
    proxyReq.setHeader('DomainName', DomainName);
    proxyReq.setHeader('content-type', 'application/json');
    if (req.method === 'POST' || req.method === 'PUT') {
      const { rawBody, body: requestBody } = req;
      if (requestBody && rawBody) {
        proxyReq.removeHeader('content-length');
        proxyReq.write(rawBody);
        proxyReq.end();
      }
    }
    return proxyReq;
  };
  const proxyGateway = k2c(createProxyMiddleware('/gateway', {
    target: 'http://api.gateway.lowcode',
    changeOrigin: true,
    onProxyReq,
  }));

  const proxyGW = k2c(createProxyMiddleware('/gw', {
    target: `http://${TENANT_ID}-${PROJECT_ID}.gateway.lowcode`,
    changeOrigin: true,
    onProxyReq,
  }));
  return async function(ctx, next) {
    if (ctx.request.url.startsWith('/gateway/')) {
      await proxyGateway(ctx, next);
    } else if (ctx.request.url.startsWith('/gw/')) {
      await proxyGW(ctx, next);
    } else {
      await next();
    }
  };
};
