require('dotenv').config();
const mongoose = require('mongoose');
const {hourlyPrevSchema} = require('./Schema/hourlyPrev.js');
const {dailyPrevSchema} = require('./Schema/hourlyPrev.js');

let db = {}; 


async function connect(){
    try{
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PSWD}@mycluster.kvsrvry.mongodb.net/Weather?retryWrites=true&w=majority&appName=MyCluster/Weather`);
        console.log("Connect: True")
    }catch(err){
        console.log(err);
        return;
    }
    
    
}

async function disconnect(){
    await mongoose.connection.close();
    console.log("Connect: False");
}

async function addHourly(cityName, object){
    const year = (object.daily.time[0]).substring(0,4);
    const Model = mongoose.model(year, hourlyPrevSchema);
    for(let i in object.hourly.time){
        await Model.create({
            cityName: cityName, 
            latitude: object.latitude,
            longitude: object.longitude,
            daily: true,
            date: object.hourly.time[i].substring(5,10),
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

async function addDaily(cityName, object){
    const year = (object.daily.time[0]).substring(0,4);
    const Model = mongoose.model(year, dailyPrevSchema);
    for(let i in object.daily.time){
        await Model.create({
            cityName: cityName, 
            latitude: object.latitude,
            longitude: object.longitude,
            daily: false,
            date: object.hourly.time[i].substring(5,10),
            data: {
                temperatureMax: object.daily.temperature_2m_max[i],
                temperatureMin: object.daily.temperature_2m_min[i]
            }
        })
    }
}

async function addPrevisons(cityName, object){
    Promise.all([addHourly(cityName, object),addDaily(cityName, object)])
    .then((result) => {
        console.log("Sucess upload");
    })
    .catch((err) => {
        console.error(err);
    })
}

db.mongoose = mongoose;
db.hourlyPrevSchema = hourlyPrevSchema;
db.dailyPrevSchema = dailyPrevSchema;
db.connect = connect;
db.disconnect = disconnect;
db.addPrevisions = addPrevisons;

module.exports = db; 