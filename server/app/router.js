'use strict';
const path = require('path');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, utils } = app;
  const files = utils.template.router(app);
  files.forEach(file => {
    const name = path.basename(file, '.html');
    const pageRender = async function(ctx) {
      await ctx.render(file, {});
    };
    router.get('/' + name, pageRender);
    if (name === 'index') {
      router.get('/', pageRender);
    }
    if (file.endsWith('.html')) {
      router.get(new RegExp(`^\/${name}\/(.*?)$`), pageRender);
    }
  });
};
