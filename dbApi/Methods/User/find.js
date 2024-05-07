const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

/**
 * Find user in the database
 * @async
 * @param {string} password 
 * @param {string} [email=undefined] 
 * @param {string} [username=undefined] 
 * @returns {(Promise<boolean> | Promise<object>)} Return user object (or false)
 */


async function findUser(email = undefined, username = undefined) {
  if (username == undefined && email == undefined ||
    username == "" && email == "") {
    return false;
  }
  let result = undefined;

  try {
    if (username != undefined && email == undefined) {
      result = await User.findOne({ username: username });

    }

    if (username == undefined && email != undefined) {
      result = await User.findOne({ email: email });
    }
  } catch (err) {
    console.error(err);
    result = false
  }

  return result;
}

module.exports = { findUser }