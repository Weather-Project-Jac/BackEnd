require('dotenv').config();
const mongoose = require('mongoose');
const { PrevisionSchema } = require('./Schema/prevision.js')
const { UserSchema } = require('./Schema/user.js');
const { addPrevisions } = require('./Methods/Prevision/addPrevisions.js');
const { findWeather } = require('./Methods/Prevision/findWeather.js');
const { registerUser } = require('./Methods/User/register.js');
const { findUser } = require('./Methods/User/find.js');
const { updateUser } = require('./Methods/User/update.js');
const { deleteUser } = require('./Methods/User/delete.js');


let db = {};

/**
 * Connect to database
 * @async
 * @returns {Promise<void>}
 */
async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PSWD}@mycluster.kvsrvry.mongodb.net/Weather?retryWrites=true&w=majority&appName=MyCluster/Weather`);
        console.log("Connect: True")
    } catch (err) {
        console.log(err);
        return;
    }
}

/**
 * Disconnect from database
 * @returns {Promise<void>}
 */
async function disconnect() {
    await mongoose.connection.close();
    console.log("Connect: False");
}


db.mongoose = mongoose;
db.PrevisionSchema = PrevisionSchema;
db.userSchema = UserSchema;
db.connect = connect;
db.disconnect = disconnect;
db.addPrevisions = addPrevisions;
db.findWeather = findWeather;
db.registerUser = registerUser;
db.findUser = findUser;
db.updateUser = updateUser;
db.deleteUser = deleteUser;
module.exports = { db };