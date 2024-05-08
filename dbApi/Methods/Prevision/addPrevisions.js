const mongoose = require('mongoose');
const { addDaily } = require('./addDaily.js');
const { addHourly } = require('./addHourly.js');
const { basePrevSchema } = require('../../Schema/basePrev.js');

/**
 * Create hourly and daily previsions in database
 * @async
 * @param {string} cityName - The name of the city
 * @param {string} countryCode - The code of the country
 * @param {string} stateCode - The code of the state
 * @param {object} object - The previsions object
 * @returns {Promise<boolean>} Return 'true' if not error catch (or false)
 */

async function addPrevisions(cityName, countryCode, stateCode, object) {
    let result = true
    try{
        const year = (object.daily.time[0]).substring(0, 4);
        const baseModel = mongoose.model(year, basePrevSchema);
        await addHourly(cityName, countryCode, stateCode, object);
        await addDaily(cityName, countryCode, stateCode, object);
    }catch(err){
        console.error(err);
        result = false;
    }
    
    return result;
}

module.exports = { addPrevisions }