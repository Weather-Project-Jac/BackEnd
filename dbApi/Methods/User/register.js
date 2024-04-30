const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

async function registerUser(object) {
    let result = true
    try {
        await User.create({
            username: object.username,
            email: object.email,
            profile_image_url: object.image,
            salt: object.salt,
            hash: object.hash
        })

    } catch (err) {
        console.log(err);
        result = false
    }
    return result
}

module.exports = { registerUser }