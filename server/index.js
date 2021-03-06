const Koa = require('koa')
const { resolve } = require('path')
const { connect, initSchemas, initAdmin } = require('./database/init')
const R = require('ramda')  //函数式编程库
var cors = require('koa2-cors');
const MIDDLEWARES = ['common', 'router']

// 遍历所有中间件
const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

  ; (async () => {
    await connect()  //建立连接

    initSchemas()   //初始化Schemas

    await initAdmin() //初始化管理员账号

    // 是否需要爬取数据
    // require('./tasks/movie')
    // require('./tasks/api')
    // require('./tasks/trailer')
    // require('./tasks/qiniu')

    const app = new Koa()
    app.use(cors())
    await useMiddlewares(app)  //use所有中间件，包括了路由

    // var port = Math.floor(Math.random() * 10000) + 3000
    // console.log("now port is", port)
    app.listen(3000)
  })()
