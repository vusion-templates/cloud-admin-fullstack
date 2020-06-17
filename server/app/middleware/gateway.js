'use strict';
module.exports = function() {
  return async function(ctx, next) {
    if (ctx.request.url.startsWith('/gateway/')) {
      await ctx.proxyRequest('api.gateway.lowcode', {
        rewrite(urlObj) {
          urlObj.port = '80';
          return urlObj;
        },
        async beforeResponse(proxyResult) {
          proxyResult.headers['set-cookie'].push(
            'authorization=' + proxyResult.headers.authorization + '; Path=/; HttpOnly'
          );
          return proxyResult;
        },
      });
    } else {
      await next();
    }
  };
};
