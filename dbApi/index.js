require('dotenv').config();
const mongoose = require('mongoose');
const {hourlyPrevSchema} = require('./Schema/hourlyPrev.js')

let db = {}; 


async function connect(){
    try{
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PSWD}@mycluster.kvsrvry.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster/Weather`);
    }catch(err){
        console.log(err);
        return;
    }
    console.log("Connect: True")
    
}

async function addHourly(cityName, object){
    const Model = mongoose.Model("a", hourlyPrevSchema);
    for(let i of object.time){
        await Model.create({
            cityName: cityName, 
            latitude: lat,
            longitude: lon,
            daily: true,
            date: "",
            data: {
                relativeHumidity: object.relative_humidity_2m[i],
                apparentTemperature: object.apparent_tempersture[i],
                precipitationProb: object.precipitation_probability[i],
                windSpeed: object.wind_speed_10m[i],
                temperature80m: object.temperature_80m[i]
            }
        })
    }
}

async function addPrevisons(cityName, object){
    await addHourly(cityName ,object.Hourly);
}

db.mongoose = mongoose;
db.prevSchema = prevSchema;
db.connect = connect;
db.addPrevision = addPrevisons;

module.exports = db;