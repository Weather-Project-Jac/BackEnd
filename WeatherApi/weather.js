//richiamo tutte le librerie espresse
const axios = require("axios")

const { getPosition } = require("./position")

//definisco la funzione per recuperare il meteo
async function getWeather(location, countryDate, stateCode, startDate, endDate) {
  console.log("start date: " + startDate + " end date: " + endDate)
  let long = undefined
  let lat = undefined
  //recupero dati della location

  let data = await getPosition(location, countryDate, stateCode)

  if (data == undefined) {
    return false
  }

  try {
    //recupero latitudine e longitudine
    long = data["results"][0]["longitude"]
    lat = data["results"][0]["latitude"]
  } catch (error) {
    console.log(error)
    return false
  }

  //controllo se è stata mandata una data di inizio o una di fine, in caso negativo rimane il valore definito prima
  if (startDate != undefined) {
    startD = startDate
  } else {
    startD = endDate
  }

  if (endDate != undefined) {
    endD = endDate
  }

  console.log("start date: " + startD + " end date: " + endD)

  //mi assicuro che latitudine e longitudine non sia null
  if (long == undefined || lat == undefined) {
    return "error lat e long non trovati"
  }

  //definisco l'URL per connettermi all'API
  const urlWeather = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,temperature_80m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&start_date=" + startD + "&end_date=" + endD

  //recupero tutti i dati ricevuti dalla chiamata
  let date = (await axios.get(urlWeather))["data"]
  return date
}

module.exports = { getWeather }