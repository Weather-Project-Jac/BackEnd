const express = require('express')
const rWeather = express.Router()

const { getWeather } = require("../WeatherApi/weather.js")
const { db } = require("../dbApi/index.js")

//send today weather
rWeather.get("/:location", async (req, res) => {
  //prendo il parametro inviato
  let location = req.params.location

  console.log(location)

  //controllo che il parametro non sia null
  if (location == undefined) {
    res.status(500).send("Il campo Location non dev'essere null")
    return
  }

  //definisco le variabili con dei valori di default
  let result = undefined
  let date = (new Date().toISOString()).substring(0, 10)


  //recupero di dati dal db
  await db.connect()
  try {
    result = await db.findWeather(location, date)
  } catch (error) {
    console.log(error)
  }

  console.log(result)
  //controllo se i dati che ho ricercato sono stati trovati
  if (result != undefined) {
    res.status(200).send(result)
    return true
  }

  //recupero i dati dal API
  result = await getWeather(location)
  if (!result) {
    res.status(500).send("Location not found")
    return
  }
  //li salvo nel db
  await db.addPrevisions(result)

  //li invio dall'utente
  res.status(200).send(result)
})

//send range date weather
rWeather.get("/:location/:dateStart/:dateEnd", async (req, res) => {
  //recupero tutti i campi inviati
  let dateS = req.params.dateStart
  let dateE = req.params.dateEnd
  let location = req.params.location

  //controllo che i campi non siano undefined
  if (dataS == undefined || dataE == undefined || location == undefined) {
    res.status(500).send("i campi inviati non sono validi")
    return
  }

  let result = undefined


  await db.connect()

  //recupero i dati dal db
  result = await db.findWeather(location, dateE, dateS)
  console.log(result)

  //controllo se ho ricevuto qualcosa
  if (result != undefined) {
    res.status(200).send(result)
    return true
  }

  //se non ho ricevuto niente mando la richiesta all API
  result = await getWeather(location, dateS, dateE)

  if (!result) {
    res.status(500).send("Location not found")
    return
  }

  await db.addPrevisions(result)
  res.status(200).send(result)
})


module.exports = { rWeather }