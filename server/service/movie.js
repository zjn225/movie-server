const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

export const findAndRemove = async (id) => {
  const movie = await Movie.findOne({ _id: id })
  if (movie) {
    await movie.remove()
    console.log("删除成功")
  }
}

export const getAllMovies = async (type, year) => {
  let query = {}
  if (type) {
    query.movieTypes = {
      $in: [type]
    }
  }
  if (year) {
    query.year = year
  }
  const movies = await Movie.find(query)
  return movies
}

export const getMovieDetail = async (id) => {
  const movie = await Movie.findOne({ _id: id })
  return movie
}
export const getRelativeMovies = async (movie) => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })
  return movies
}

export const updateMovieItem = async (id, poster, rawTitle, movieTypes, pubdate) => {
  let query = { _id: id }
  let movie = await Movie.findOne(query)
  let country = ""
  let newMovie = {}
  // 日期设置
  if (pubdate) {
    if (movie.pubdate[0].country === "中国大陆") {
      country = "中国大陆"
      pubdate = [
        {
          country: "中国大陆",
          date: pubdate
        }
      ]
    } else {
      country = "其他"
      pubdate = [
        {
          country: "其他",
          date: pubdate
        }
      ]
    }
  }
  
  //电影类型设置
  if (movieTypes) {
    movieTypes = movieTypes.split("、")
  }

  if (country === "中国大陆") {
    newMovie = await Movie.update(query, { $set: { poster, rawTitle, movieTypes, pubdate } })
  } else {
    newMovie = await Movie.update(query, { $set: { poster, title: rawTitle, movieTypes, pubdate } })
  }
}
