//creo la funzione per recuperare dati su una location specifica
async function getPosition(location) {
  let result = undefined

  //definisco l'URL per la connessione
  const urlGeo = "https://geocoding-api.open-meteo.com/v1/search?name=" + location + "&count=10&language=en&format=json"

  try {
    //recupero i dati ricevuti
    let { data } = await axios.get(urlGeo)
    result = data
  } catch (error) {
    console.log(error)
  }

  return result
}

module.exports = { getPosition }