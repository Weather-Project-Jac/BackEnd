const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

/**
 * Find user in the database
 * @async
 * @param {string} password 
 * @param {string} [email=undefined] 
 * @param {string} [username=undefined] 
 * @returns {(Promise<undefined> | Promise<object>)} Return user object (or undefined)
 */
async function findUser(email = undefined, username = undefined) {
    console.log(email, username)
    if (username == undefined && email == undefined) {
        return false;
    }
    let result = undefined;

    if (username != undefined && email == undefined) {
        result = await User.findOne({ username: username});
    }

    if (username == undefined && email != undefined) {
        result = await User.findOne({ email: email});
    }

    return result;
}

module.exports = { findUser }