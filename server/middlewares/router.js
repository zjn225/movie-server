const { Route } = require('../lib/decorator')  //这个Route不是koa的，而是来自装饰类的Route
const { resolve } = require('path')

export const router = app => {
  const apiPath = resolve(__dirname, '../routes')
  const router = new Route(app, apiPath)

  router.init()   
}
