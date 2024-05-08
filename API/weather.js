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

  console.log(location, contryCode, stateCode)

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

  console.log("result DB " + result.length)
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
  } catch (error) {
    console.log(error)
  }

  //li invio dall'utente
  res.status(200).send(result)
})

rWeather.get("/:location/:countryCode/:stateCode/:dateStart/:dateEnd", async (req, res) => {
  let location = req.params.location.toLowerCase()
  let countryCode = req.params.countryCode.toUpperCase()
  let stateCode = req.params.stateCode.toUpperCase()
  let dateS = req.params.dateStart
  let dateE = req.params.dateEnd

  let alphaTime = (new Date(dateE)).getTime() - (new Date(dateS)).getTime()
  alphaTime = Math.floor(alphaTime / (1000 * 60 * 60 * 24))

  let result = undefined

  await db.connect()
  result = await db.findWeather(location, countryCode, stateCode, dateE, dateS)


  if (result) {
    let date = controlResult(result, [dateS, dateE])

    if (date) {

      while (date.length > 0) {
        console.log(date[0])
        result = await getWeather(location, countryCode, stateCode, undefined, date[0])
        await db.addPrevisions(location, countryCode, stateCode, result)
        date.shift()
      }
      result = await db.findWeather(location, countryCode, stateCode, dateE, dateS)
      res.status(200).send(result)
      return
    } else {
      res.status(200).send(result)
      return
    }
  }

  result = await getWeather(location, countryCode, stateCode, dateS, dateE)
  await db.addPrevisions(location, countryCode, stateCode, result)

  result = await db.findWeather(location, countryCode, stateCode, dateE, dateS)
  res.status(200).send(result)
})

function controlResult(object, range) {

  let startD = parseInt(range[0].substring(8, 10))
  let endD = parseInt(range[1].substring(8, 10))


  let allD = []
  let toReserch = []

  // problema se due mesi differenti da errore ovviamente
  for (let i = startD; i <= endD; i++) {
    allD.push(i)
  }


  object.forEach(element => {
    let date = parseInt(element["date"].substring(3, 5))
    if (allD.includes(date)) {
      const index = allD.indexOf(date);
      if (index > -1) { // only splice array when item is found
        allD.splice(index, 1); // 2nd parameter means remove one item only
      }
    }
  })


  //questo crea un bellissimo problema (se sono di due mesi diversi non funzia bene perchè non va)
  allD.forEach(element => {
    toReserch.push(range[0].substring(0, 8) + (element.toString().length < 2 ? "0" + element : element))
  })

  return toReserch.length < 1 ? undefined : toReserch
}

module.exports = { rWeather }