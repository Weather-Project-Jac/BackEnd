//richiamo tutte le librerie espresse
const axios = require("axios")

//creo la funzione per recuperare dati su una location specifica
async function getPosition(location) {

  //definisco l'URL per la connessione
  const urlGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json"

  //recupero i dati ricevuti
  let { data } = await axios.get(urlGeo)

  return data
}

//definisco la funzione per recuperare il meteo
async function getWeather(location, startDate = undefined, endDate = undefined) {

  //recupero dati della location
  let data = await getPosition(location)

  //recupero latitudine e longitudine
  let long = data["results"][0]["longitude"]
  let lat = data["results"][0]["latitude"]

  //definisco un valore di default per data inizio e fine
  let startD = (new Date().toISOString()).split("T")[0]
  let endD = (new Date().toISOString()).split("T")[0]

  //controllo se è stata mandata una data di inizio o una di fine, in caso negativo rimane il valore definito prima
  if (startDate != undefined) {
    startD = startDate
  }

  if (endDate != undefined) {
    endD = endDate
  }

  //mi assicuro che latitudine e longitudine non sia null
  if (long == undefined || lat == undefined) {
    return "error lat e long non trovati"
  }

  //definisco l'URL per connettermi all'API
  const urlWheather = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + long + "&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,wind_speed_10m,temperature_80m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&start_date=" + startD + "&end_date=" + endD

  //recupero tutti i dati ricevuti dalla chiamata
  let date = (await axios.get(urlWheather))["data"]
  return date
}

module.exports = { getWeather }