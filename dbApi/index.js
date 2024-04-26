require('dotenv').config();
const mongoose = require('mongoose');
const { hourlyPrevSchema } = require('./Schema/hourlyPrev.js');
const { dailyPrevSchema } = require('./Schema/hourlyPrev.js');

const { getWeather } = require("../WeatherApi/index.js")

let db = {};


async function connect() {
    try {
        console.log(process.env.USER)
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

db.mongoose = mongoose;
db.hourlyPrevSchema = hourlyPrevSchema;
db.dailyPrevSchema = dailyPrevSchema;
db.connect = connect;
db.disconnect = disconnect;
db.addPrevisions = addPrevisons;
db.findWeather = findWeather;

module.exports = db;

// let location = "Bergamo"
// db.connect().then(() => {
//     findWeather("Bergamo", "2024-04-26", "2024-03-26").then(element => {
//         console.log("result:")
//         console.log(element)
//     }).catch(error => {
//         console.log(error)
//     })
// })