// 拿到装饰器
const {
  controller,
  get
} = require('../lib/decorator')
const {
  getAllMovies,
  getMovieDetail,
  getRelativeMovies
} = require('../service/movie')

@controller('/movies')  //前面加了@是装饰器,类似于追加controller功能
export class movieController {
  @get('/')                    //追加get("/")功能
  async getMovies (ctx, next) { //getMovie是本来自带的，不是追加
    console.log("getMovies")
    const { type, year } = ctx.query
    const movies = await getAllMovies(type, year)
    ctx.body = {
      success: true,
      data: movies
    }
  }

  @get('/:id')
  async getRelativeMovies (ctx, next) {
    console.log("getDetail")
    const id = ctx.params.id  //取得传入的参数id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}
