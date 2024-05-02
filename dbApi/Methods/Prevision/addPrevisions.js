const { addDaily } = require('./addDaily.js');
const { addHourly } = require('./addHourly.js')

/**
 * Create hourly and daily previsions in database
 * @async
 * @param {string} cityName - The name of the city
 * @param {string} countryCode - The code of the country
 * @param {object} object - The previsions object
 * @returns {Promise<boolean>} Return 'true' if not error catch (or false)
 */

async function addPrevisions(cityName, countryCode, object) {
    let result = true
    // Promise.all([addHourly(cityName, countryCode, object), addDaily(cityName, countryCode, object)])
    //     .then((result) => {
    //         console.log("Sucess upload");
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //         result = false;
    //     })
    try{
        await addHourly(cityName, countryCode, object);
        await addDaily(cityName, countryCode, object);
    }catch(err){
        console.error(err);
        result = false;
    }
    
    return result;
}

module.exports = { addPrevisions }