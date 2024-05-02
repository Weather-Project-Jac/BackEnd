const axios = require("axios")

//creo la funzione per recuperare dati su una location specifica
async function getPosition(location, contryCode = undefined) {
  location = location[0].toUpperCase() + (location.substring(1, location.length))
  let result = undefined

  //definisco l'URL per la connessione
  const urlGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json"

  let lunghezza = 1
  try {
    //recupero i dati ricevuti
    let { data } = await axios.get(urlGeo)
    result = data
    lunghezza = result["results"].length
  } catch (error) {
    console.log(error)
  }


  let filtered = { "results": [] }
  result["results"].forEach(element => {
    if (element["name"] == location && element["country_code"] == contryCode) {
      filtered["results"].push(element)
    }
  });
  result = filtered

  return result
}

module.exports = { getPosition }