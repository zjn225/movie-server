// 爬某个详情页的预告视频的父进程
const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose') //操作数据库用
const Movie = mongoose.model('Movie')//拿到Movie的model

;(async () => {
  const script = resolve(__dirname, '../crawler/trailer-list')
  const child = cp.fork(script, [])
  let invoked = false

  child.on('error', err => {
    if (invoked) return

    invoked = true

    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return

    invoked = true
    let err = code === 0 ? null : new Error('exit code ' + code)

    console.log(err)
  })

  child.on('message', data => {
    let result = data.result
    // 开始存储movie数据,先判断数据库是否有
    result.forEach(async item => {
      let movie = await Movie.findOne({
        doubanId: item.doubanId
      })
      if (!movie) {
        console.log("开始存储：",item.rawTitle)
        movie = new Movie(item)
        await movie.save()
      }
    })
  })
})()
