'use strict';

const Controller = require('egg').Controller;
class DevController extends Controller {
  add(ctx) {
    ctx.body = 'Hello World';
    ctx.status = 200;
  }
}
module.exports = DevController;
