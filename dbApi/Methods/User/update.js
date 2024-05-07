const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

/**
 * Update user in the database
 * @async
 * @param {object} update - object tha contains the key(s) to update
 * @param {string} email
 * @returns {(Promise<boolean> | Promise<object>)} Return user object (or false)
 */
async function updateUser(update, email) {
    if (email == undefined || email == ""){
        return false;
    }

    let result = false;
    try{
        if (email != undefined) {

            for(let [key, value] of Object.entries(update)){

                if(key.toString() == "favorites"){
                    let doc = await findOne({email: email});
                    if(doc.favorites.includes(value)){
                        result = await User.findOneAndUpdate({ email: email }, { $pull: { favorites: value }}, { new: true });
                    }else{
                        result = await User.findOneAndUpdate({ email: email }, { $push: { favorites: value }}, { new: true });
                    }
                }else{
                    result = await User.findOneAndUpdate({ email: email }, {key: value}, { new: true });
                }
            }
        }
        
    }catch(err){
        console.error(err);
        result = false;
    }
    

    return result;
}

module.exports = { updateUser }