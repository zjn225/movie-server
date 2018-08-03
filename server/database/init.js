const mongoose = require('mongoose')
const db = 'mongodb://127.0.0.1/douban-trailer'
const glob = require('glob')
const { resolve } = require('path')

mongoose.Promise = global.Promise

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

// 创建管理员账号
exports.initAdmin = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    username: 'zjn225'
  })

  if (!user) {
    const user = new User({
      username: 'zjn225',
      email: '740627396@qq.com',
      password: '000420',
      role: 'admin'
    })

    await user.save()
  }
}

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
      // const Dog = mongoose.model('Dog', { name: String })
      // const doga = new Dog({ name: '阿尔法' })

      // doga.save().then(() => {
      //   console.log('wang')
      // })
      resolve()
      console.log('MongoDB Connected successfully!')
    })
  })
}
