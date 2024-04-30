const mongoose = require('mongoose');
const { hourlyPrevSchema } = require('../../Schema/hourlyPrev.js');

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

module.exports = { addHourly }