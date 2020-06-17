'use strict';
const Cookies = require('egg-cookies');
module.exports = function() {
  return async function(ctx, next) {
    const cookies = new Cookies(ctx, Array.isArray(ctx.app.config.keys) ? ctx.app.config.keys : [ ctx.app.config.keys ]);
    const authorization = cookies.get('authorization', {
      signed: false,
    });
    if (authorization) {
      ctx.request.headers.authorization = authorization;
    }
    await next();
  };
};
