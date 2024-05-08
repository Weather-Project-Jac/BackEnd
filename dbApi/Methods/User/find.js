const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

/**
 * Find user in the database
 * @async
 * @param {string} email
 * @returns {(Promise<boolean> | Promise<object>)} Return user object (or false)
 */


async function findUser(email) {
  if (email == undefined || email == "") {
    return false;
  }
  let result = false;

  try {
    result = await User.findOne({ email: email });
  } catch (err) {
    console.error(err);
    result = false
  }

  return result;
}

module.exports = { findUser }