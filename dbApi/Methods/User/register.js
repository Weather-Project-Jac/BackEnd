const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

/**
 * Add user in the database
 * @async
 * @param {object} object - User object
 * @returns {Promise<boolean>}  Return 'true' if not error catch (or false)
 */
async function registerUser(object) {
    try {
        await User.create({
            username: object.username,
            email: object.email,
            profile_image_url: object.image,
            salt: object.salt,
            hash: object.hash
        })

    } catch (err) {
        console.error(err);
        result = false
    }
    return true;
}

module.exports = { registerUser }