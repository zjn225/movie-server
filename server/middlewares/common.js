import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import session from 'koa-session'
import convert from 'koa-convert';

// 解析post数据用到的中间件
export const addBodyParser = app => {
  app.use(bodyParser())
}

// 日志记录
export const addLogger = app => {
  app.use(logger())
}

// 添加session
export const addSession = app => {
  app.keys = ['zjn-movie']

  const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    overwrite: true,
    httpOnly: false,
    signed: true,
    rolling: false
  }

  app.use(convert(session(CONFIG, app)))
}
