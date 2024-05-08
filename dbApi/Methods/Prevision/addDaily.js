const mongoose = require('mongoose');
const { dailyPrevSchema } = require('../../Schema/dailyPrev.js');
/**
 * Create daily previsions in database
 * @async
 * @param {string} cityName - The name of the city
 * @param {string} countryCode - The code of the country
 * @param {string} stateCode - The code of the state
 * @param {object} object - The previsions object
 * @returns {Promise<void>} Promise void
 * 
 */
async function addDaily(cityName, countryCode, stateCode, object) {
    console.log(object)
    const year = (object.daily.time[0]).substring(0, 4);
    let dailyModel = mongoose.model(year, dailyPrevSchema);
    for (let i in object.daily.time) {
        await dailyModel.create({
            cityName: cityName,
            countryCode: countryCode,
            stateCode: stateCode,
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