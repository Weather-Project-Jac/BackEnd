const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

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