const { addDaily } = require('./addDaily.js');
const { addHourly } = require('./addHourly.js')

/**
 * Create hourly and daily previsions in database
 * @async
 * @param {string} cityName - The name of the city
 * @param {object} object - The previsions object
 * @returns {boolean} Return 'true' if not error found (else false)
 */

async function addPrevisions(cityName, object) {
    console.log(object)
    Promise.all([addHourly(cityName, object), addDaily(cityName, object)])
        .then((result) => {
            console.log("Sucess upload");
            return true;
        })
        .catch((err) => {
            console.error(err);
            return false;
        })
}

module.exports = { addPrevisions }