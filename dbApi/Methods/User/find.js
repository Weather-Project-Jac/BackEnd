const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

async function findUser(password, email = undefined, username = undefined) {
    if (username == undefined && email == undefined) {
        return false;
    }

    let result = undefined;

    if (username != undefined && email == undefined) {
        result = await User.findOne({ username: username, hash: password });

    }

    if (username == undefined && email != undefined) {
        result = await User.findOne({ email: email, hash: password });
    }

    return result;
}

module.exports = { findUser }