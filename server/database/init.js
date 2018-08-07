const mongoose = require('mongoose')
const db = 'mongodb://127.0.0.1/douban-trailer'
const glob = require('glob')
const { resolve } = require('path')

mongoose.Promise = global.Promise

// 初始化Schemas。
// Schema定义了collection里documents的模板。每一个Schema都会映射到MongoDB的一个collection上
exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

// 创建管理员账号
exports.initAdmin = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    username: 'admin'
  })
  if (!user) {
    const user = new User({
      username: 'admin',
      email: '740627396@qq.com',
      password: 'admin',
      role: 'admin'
    })
    await user.save()
  }
}

// 和数据库建立连接
exports.connect = () => {
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    mongoose.connect(db)

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧，快去修吧少年')
      }
    })

    mongoose.connection.on('error', err => {
      console.log(err)
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库挂了吧，快去修吧少年')
      }
    })

    mongoose.connection.once('open', () => {
      resolve()
      console.log('MongoDB Connected successfully！！！!')
    })
  })
}
