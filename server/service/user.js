const mongoose = require('mongoose')
const User = mongoose.model('User')

export const checkPassword = async (username, password) => {
  let match = false
  const user = await User.findOne({ username })

  if (user) {
    match = await user.comparePassword(password, user.password)
  }

  return {
    match,
    user
  }
}
