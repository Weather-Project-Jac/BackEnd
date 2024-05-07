const mongoose = require('mongoose');
const { hourlyPrevSchema } = require('../../Schema/hourlyPrev.js');
const { dailyPrevSchema } = require('../../Schema/dailyPrev.js');

/**
 * Find in the database the weather
 * @async
 * @param {string} cityName - The name of the city
 * @param {string} countryCode - The code of the country
 * @param {string} stateCode - The code of the state
 * @param {string} [endD=undefined] - End date
 * @param {string} [startD=undefined] - Start date
 * @returns {(Promise<boolean> | Promise<object>)} Return weather object (or false)
 */
async function findWeather(cityName, countryCode, stateCode, endD = undefined, startD = undefined) {
  let schema = hourlyPrevSchema
  let daily = true

  if (endD == undefined) {
    endD = (new Date().toISOString())
  }

  let sd = undefined
  let sy = undefined

  if (startD != undefined) {
    schema = dailyPrevSchema
    daily = false

    sy = startD.substring(0, 4)
    sd = startD.substring(5, 10)
  }

  if ((startD != undefined && startD.length != 10) && endD.length != 10) {
    return false
  }

  let year = endD.substring(0, 4)
  let date = endD.substring(5, 10)

  const Model = mongoose.model(year, schema);
  let result = undefined
  try {
    if (daily) {
      result = await Model.find({ "daily": true, "date": date, "cityName": cityName, "countryCode": countryCode, "stateCode": stateCode })
    } else {
      result = await Model.find({
        "daily": true, "cityName": cityName, "countryCode": countryCode, "stateCode": stateCode,
        "date": {
          $gte: sd,
          $lt: date
        }
      })
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  return result == "" ? false : result
}

module.exports = { findWeather }