const mongoose = require('mongoose');
const { UserSchema } = require('../../Schema/user');
const User = mongoose.model("User", UserSchema);

/**
 * Update user in the database
 * @async
 * @param {object} update - object tha contains the key(s) to update
 * @param {string} [username=undefined] 
 * @param {string} [email=undefined] 
 * @returns {(Promise<boolean> | Promise<object>)} Return user object (or undefined)
 */
async function updateUser(update, username = undefined, email = undefined) {
    if (username == undefined && email == undefined ||
        username == "" && email == "") 
    {
        return false;
    }

    let result = undefined;
    try{
        for(let [key, value] of Object.entries(update)){

            if (username != undefined && email == undefined) {
                if(key.toString() == "favorites"){
                    let doc = await findOne({username: username});
                    if(doc.favorites.includes(value)){
                        result = await User.findOneAndUpdate({ username: username }, { $pull: { favorites: value }}, { new: true });
                    }else{
                        result = await User.findOneAndUpdate({ username: username }, { $push: { favorites: value }}, { new: true });
                    }
                    
                }else{
                    result = await User.findOneAndUpdate({ username: username }, {key: value}, { new: true });
                }
                
        
            }
        
            if (username == undefined && email != undefined) {
                if(key.toString() == "favorites"){
                    let doc = await findOne({username: username});
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