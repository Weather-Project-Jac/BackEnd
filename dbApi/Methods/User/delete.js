const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user.js');
const User = mongoose.model("User", UserSchema);

/**
 * Delete user from database
 * @async
 * @param {strig} username 
 * @param {string} email 
 * @returns {Promise<boolean>} Return 'true' if not error catch (or false)
 */
async function deleteUser(username, email) {
    if (username == null && email == null) {
        return false;
    }

    await User.deleteOne({ username: username, email: email });

    return true;
}

module.exports = { deleteUser }