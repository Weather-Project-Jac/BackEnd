require('dotenv').config();
const mongoose = require('mongoose');
const { hourlyPrevSchema } = require('./Schema/hourlyPrev.js');
const { dailyPrevSchema } = require('./Schema/hourlyPrev.js');
const {UserSchema} = require('./Schema/user.js');

let db = {};

//define user model
const User = mongoose.model("User", UserSchema);

async function connect() {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PSWD}@mycluster.kvsrvry.mongodb.net/Weather?retryWrites=true&w=majority&appName=MyCluster/Weather`);
        console.log("Connect: True")
    } catch (err) {
        console.log(err);
        return;
    }
}

async function disconnect() {
    await mongoose.connection.close();
    console.log("Connect: False");
}

async function addHourly(cityName, object) {
    const year = (object.daily.time[0]).substring(0, 4);
    const Model = mongoose.model(year, hourlyPrevSchema);
    for (let i in object.hourly.time) {
        await Model.create({
            cityName: cityName,
            latitude: object.latitude,
            longitude: object.longitude,
            daily: true,
            date: object.hourly.time[i].substring(5, 10),
            hour: object.hourly.time[i].substring(11),
            data: {
                relativeHumidity: object.hourly.relative_humidity_2m[i],
                apparentTemperature: object.hourly.apparent_temperature[i],
                precipitationProb: object.hourly.precipitation_probability[i],
                windSpeed: object.hourly.wind_speed_10m[i],
                temperature80m: object.hourly.temperature_80m[i]
            }
        })
    }

}

async function addDaily(cityName, object) {
    const year = (object.daily.time[0]).substring(0, 4);
    const Model = mongoose.model(year, dailyPrevSchema);
    for (let i in object.daily.time) {
        await Model.create({
            cityName: cityName,
            latitude: object.latitude,
            longitude: object.longitude,
            daily: false,
            date: object.hourly.time[i].substring(5, 10),
            data: {
                temperatureMax: object.daily.temperature_2m_max[i],
                temperatureMin: object.daily.temperature_2m_min[i]
            }
        })
    }
}

async function addPrevisons(cityName, object) {
    Promise.all([addHourly(cityName, object), addDaily(cityName, object)])
        .then((result) => {
            console.log("Sucess upload");
        })
        .catch((err) => {
            console.error(err);
        })
}

async function findWeather(cityName, endD, startD = undefined) {
    let schema = hourlyPrevSchema
    let daily = true


    let sd = undefined
    let sy = undefined

    if (startD != undefined) {
        schema = dailyPrevSchema
        daily = false

        sy = startD.substring(0, 4)
        sd = startD.substring(5, 10)
    }

    if ((startD != undefined && startD.length != 10) || endD.length != 10) {
        return false
    }

    let year = endD.substring(0, 4)
    let date = endD.substring(5, 10)

    const Model = mongoose.model(year, schema);
    let result
    if (daily) {
        result = await Model.find({ "daily": true, "date": date, "cityName": cityName })
    } else {
        result = await Model.find({
            "daily": true, "cityName": cityName,
            "date": {
                $gte: sd,
                $lt: date
            }
        })
    }

    return result
}

async function registerUser(object){
    try{
        await User.create({
            username: object.username,
            email: object.email,
            profile_image_url: object.image,
            salt: object.salt,
            hash: object.hash
        })
    }catch(err){
        console.log(err);
    }
   
}

async function findUser(username = undefined, email = undefined){
    if(username == undefined && email == undefined){
        return false;
    }
    
    let result = undefined;

    if(username != undefined && email != undefined){
        result = User.findOne({username: username, email: email});
    }

    if(username != undefined && email == undefined){
        result = User.findOne({username: username});

    }

    if(username == undefined && email != undefined){
        result = User.findOne({email: email});
    }

    return result;
}

async function updateUser(update, username = undefined, email = undefined){
    if(username == undefined && email == undefined){
        return false;
    }
    
    let result = undefined;

    if(username != undefined && email != undefined){
        result = User.findOneAndUpdate()({username: username, email: email}, update, {new: true});
    }

    if(username != undefined && email == undefined){
        result = User.findOneAndUpdate({username: username}, update, {new: true});

    }

    if(username == undefined && email != undefined){
        result = User.findOneAndUpdate({email: email}, update, {new: true});
    }

    return result;
}

async function deleteUser(username = undefined, email = undefined){
    if(username == undefined && email == undefined){
        return false;
    } 

    if(username != undefined && email != undefined){
        User.deleteOne({username: username, email: email});
    }

    if(username != undefined && email == undefined){
        User.deleteOne({username: username});

    }

    if(username == undefined && email != undefined){
        User.deleteOne({email: email});
    }

    return true;
}


db.mongoose = mongoose;
db.hourlyPrevSchema = hourlyPrevSchema;
db.dailyPrevSchema = dailyPrevSchema;
db.userSchema = UserSchema;
db.connect = connect;
db.disconnect = disconnect;
db.addPrevisions = addPrevisons;
db.findWeather = findWeather;
db.registerUser = registerUser;
db.findUser = findUser;
db.updateUser = updateUser;
db.deleteUser = deleteUser;
module.exports = db;
