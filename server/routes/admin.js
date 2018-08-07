const {
  controller,
  get,
  post,
  del,
  auth,
  admin,
  put,
  required
} = require('../lib/decorator')
const {
  checkPassword
} = require('../service/user')
const {
  getAllMovies,
  findAndRemove,
  updateMovieItem
} = require('../service/movie')

@controller('/admin')
export class adminController {

  // 登录认证
  @post('/login')
  @required({
    body: ['username', 'password']
  })
  async login(ctx, next) {
    const { username, password } = ctx.request.body
    const matchData = await checkPassword(username, password)

    if (!matchData.user) {
      return (ctx.body = {
        success: false,
        err: '用户不存在'
      })
    }

    // 设置session
    if (matchData.match) {
      return (ctx.body = {
        success: true
      })
    }

    return (ctx.body = {
      success: false,
      err: '密码不正确'
    })
  }

  // 获取电影列列表
  @get('/movie/list')
  async getMovieList(ctx, next) {
    const movies = await getAllMovies()
    ctx.body = {
      success: true,
      data: movies
    }
  }

  // 删除电影
  @del('/movies')
  @required({
    query: ['id']
  })
  async remove(ctx, next) {
    const id = ctx.query.id
    await findAndRemove(id)
    const movies = await getAllMovies()
    ctx.body = {
      data: movies,
      success: true
    }
  }

  // 更新电影
  @put('/movieItem')
  @required({
    body: ['id', 'poster', 'rawTitle', 'movieTypes', 'pubdate']
  })
  async update(ctx, next) {
    const { id, poster, rawTitle, movieTypes, pubdate } = ctx.request.body
    await updateMovieItem(id, poster, rawTitle, movieTypes, pubdate)
    const movies = await getAllMovies()
    ctx.body = {
      data: movies,
      success: true
    }
  }
}
