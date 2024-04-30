const mongoose = require('mongoose');
const { dailyPrevSchema } = require('../../Schema/dailyPrev.js');

async function addDaily(cityName, object) {
    console.log(object)
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

module.exports = { addDaily }