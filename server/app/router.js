'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, utils } = app;
  utils.template.router(app);
  router.post('/dev/add', controller.dev.add);
};
