const axios = require("axios")

let location = "bergamo"
async function getPosition(location) {
  const urlGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json"

  let { data } = await axios.get(urlGeo)

  return data
}

async function getWeather(startDate = undefined, endDate = undefined) {
  let data = await getPosition(location)

  let long = data["results"][0]["longitude"]
  let lat = data["results"][0]["latitude"]

  let startD = (new Date().toISOString()).split("T")[0]
  let endD = (new Date().toISOString()).split("T")[0]

  if (startDate != undefined) {
    startD = startDate
  }

  if (endDate != undefined) {
    endD = endDate
  }

  if (long == undefined || lat == undefined) {
    return "error lat e long non trovati"
  }

  const urlWheather = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,temperature_80m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&start_date=" + startD + "&end_date=" + endD
  // console.log(urlWheather)
  let date = (await axios.get(urlWheather))["data"]
  return date
}


// getWeather().then(result => {
//   console.log(result)
// })

module.exports = { getWeather }