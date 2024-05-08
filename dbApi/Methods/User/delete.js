const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user.js');
const User = mongoose.model("User", UserSchema);

/**
 * Delete user from database
 * @async
 * @param {string} email 
 * @returns {Promise<boolean>} Return 'true' if not error catch (or false)
 */
async function deleteUser(email) {
    if (email == null || email == ""){
        return false;
    }

    try{
        await User.deleteOne({ email: email });
    }catch(err){
        console.error(err);
        return false;
    }
    

    return true;
}

module.exports = { deleteUser }