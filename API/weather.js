const express = require('express')
const rWeather = express.Router()

const { getWeather } = require("../WeatherApi/weather.js")
const { db } = require("../dbApi/index.js")

//send today weather
rWeather.get("/:location/:contryCode/:stateCode", async (req, res) => {
  //prendo il parametro inviato
  let location = (req.params.location).toLowerCase()
  let contryCode = req.params.contryCode.toUpperCase()
  let stateCode = req.params.stateCode.toUpperCase()

  console.log(location)
  console.log(contryCode)
  console.log(stateCode)

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
    result = await db.findWeather(location, contryCode, stateCode, date)
  } catch (error) {
    console.log(error)
  }

  console.log("result " + result)
  //controllo se i dati che ho ricercato sono stati trovati
  if (result) {
    res.status(200).send(result)
    return true
  }

  //recupero i dati dal API
  result = await getWeather(location, contryCode, stateCode)
  if (!result) {
    res.status(500).send("Location not found")
    return
  }
  //li salvo nel db
  await db.addPrevisions(location, contryCode, stateCode, result)

  try {
    result = await db.findWeather(location, contryCode, stateCode, date)
    console.log("result try " + result)
  } catch (error) {
    console.log(error)
  }

  //li invio dall'utente
  res.status(200).send(result)
})

//send range date weather
rWeather.get("/:location/:countryCode/:stateCode/:dateStart/:dateEnd", async (req, res) => {
  //recupero tutti i campi inviati
  let dateS = req.params.dateStart
  let dateE = req.params.dateEnd
  let location = req.params.location.toLocaleLowerCase()
  let countryCode = req.params.countryCode.toUpperCase()
  let stateCode = req.params.stateCode.toUpperCase()

  console.log(dateS, dateE, location, countryCode, stateCode)

  //controllo che i campi non siano undefined
  if (dateS == undefined || dateE == undefined || location == undefined) {
    res.status(500).send("i campi inviati non sono validi")
    return
  }

  let result = undefined


  await db.connect()

  //recupero i dati dal db
  result = await db.findWeather(location, countryCode, stateCode, dateE, dateS)
  // console.log("result DB: " + result)

  let tsDifference = (new Date(dateE)).getTime() - (new Date(dateS)).getTime()
  tsDifference = Math.floor(tsDifference / (1000 * 60 * 60 * 24))

  //controllo se ho ricevuto qualcosa
  if (result && controlResult(result, [dateS, dateE, tsDifference])) {
    console.log("Invio risultati db")
    res.status(200).send(result)
    return true
  }

  //se non ho ricevuto niente mando la richiesta all API
  result = await getWeather(location, countryCode, stateCode, dateS, dateE)

  console.log("result API: " + result)


  if (!result) {
    res.status(500).send("Location not found")
    return
  }

  await db.addPrevisions(location, countryCode, stateCode, result)

  try {
    result = await db.findWeather(location, countryCode, stateCode, dateE, dateS)
  } catch (error) {
    console.log(error)
  }

  res.status(200).send(result)
})

function controlResult(object, range) {
  let dateSpan = range[2]
  let date = []
  console.log(range)
  object.forEach(element => {
    date.push(element["date"])
  });

  date = compact(date)
  console.log(date)

  if (dateSpan != date.length) {
    return false
  }
  return true
}

function compact(array) {
  let final = [array[0]]

  array.forEach(element => {
    let insert = true

    final.forEach(val => {
      if (element == val) {
        insert = false
      }
      if (insert) {
        final.push(element)
      }
    })
  });
  return final
}

module.exports = { rWeather }