const mongoose = require('mongoose')
const User = mongoose.model('User')

export const checkPassword = async (username, password) => {
  let match = false
  const user = await User.findOne({ username })

  if (user) {
    console.log("hi，怎么说，我准备comparePassword了")
    // password来自用户填写，user.password来自数据库内的数据
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}
