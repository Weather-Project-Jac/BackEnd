const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

/**
 * Update user in the database
 * @async
 * @param {object} update - object tha contains the key(s) to update
 * @param {string} [username=undefined] 
 * @param {string} [email=undefined] 
 * @returns {(Promise<undefined> | Promise<object>)} Return user object (or undefined)
 */
async function updateUser(update, username = undefined, email = undefined) {
    if (username == undefined && email == undefined) {
        return false;
    }

    let result = undefined;

    if (username != undefined && email == undefined) {
        result = await User.findOneAndUpdate({ username: username }, update, { new: true });

    }

    if (username == undefined && email != undefined) {
        result = await User.findOneAndUpdate({ email: email }, update, { new: true });
    }

    return result;
}

module.exports = { updateUser }