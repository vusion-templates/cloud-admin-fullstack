/* eslint valid-jsdoc: "off" */

'use strict';
const fs = require('fs');
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {
    view: {
      defaultViewEngine: 'nunjucks',
    },
    nunjucks: {
      // dir: 'path/to/template/dir',  // default to `{app_root}/app/view`
      cache: true, // local env is false
    },
    siteFile: {
      '/favicon.ico': fs.readFileSync(path.join(__dirname, '../app/view/favicon.ico')),
    },
    customLoader: {
      utils: {
        // 相对于 app.config.baseDir
        directory: 'app/utils',
        // 如果是 ctx 则使用 loadToContext
        inject: 'app',
        // 是否加载框架和插件的目录
        loadunit: false,
        // 还可以定义其他 LoaderOptions
      },
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1589536024870_4828';

  // add your middleware config here
  config.middleware = [ 'login', 'gateway' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    login: {
      // 服务地址
      service: 'http://api.gateway.lowcode',
      // 前端地址
      login: '/login',
      // 登陆失效是否直接重定向
      redirect: true,
    },
  };
  return {
    ...config,
    ...userConfig,
  };
};
