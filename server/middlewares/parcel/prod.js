// 生产环境的配置
const views = require('koa-views')
const serve = require('koa-static')
const { resolve } = require('path')

const r = path => resolve(__dirname, path)

export const dev = async app => {
  app.use(serve(r('../../../dist')))
  // 网页的静态文件
  app.use(views(r('../../../dist')), {
    extension: 'html'
  })

  app.use(async (ctx) => {
    await ctx.render('index.html')
  })
}
