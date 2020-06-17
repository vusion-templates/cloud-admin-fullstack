'use strict';
const fs = require('fs');
const path = require('path');
module.exports = {
  router(app) {
    const { router } = app;
    app.config.view.root.forEach(template => {
      const files = fs.readdirSync(template);
      files.forEach(file => {
        const name = path.basename(file, '.html');
        const pageRender = async function(ctx) {
          await ctx.render(file, {});
        };
        router.get(new RegExp(`^\/${name}\/(.*?)$`), pageRender);
        router.get('/' + name, pageRender);
      });
    });
  },
};
