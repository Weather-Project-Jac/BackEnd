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
    console.log("find after getWeather " + result.length)
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
  console.log("Result db length: " + result.length)

  let tsDifference = (new Date(dateE)).getTime() - (new Date(dateS)).getTime()
  tsDifference = Math.floor(tsDifference / (1000 * 60 * 60 * 24))

  //controllo se ho ricevuto qualcosa
  if (result && controlResult(result, [dateS, dateE, tsDifference])) {
    console.log("Invio risultati db")
    res.status(200).send(result)
    return true
  }

  let allD = []
  if (result && !controlResult(result, [dateS, dateE, tsDifference])) {
    for (let i = 0; i <= 7; i++) {
      const SDate = new Date(dateS)
      allD.push((new Date(dateS)).getDate() + i)
    }
    result.forEach(element => {
      let number = parseInt(element["date"].substring(3, 5))

      if (allD.includes(number)) {

        const index = allD.indexOf(number);
        if (index > -1) { // only splice array when item is found
          allD.splice(index, 1); // 2nd parameter means remove one item only
        }

      }
    })
    console.log(allD)

    allD.forEach(async element => {
      let newDate = (dateE.substring(0, 7) + "-" + (element.toString().length == 2 ? element : "0" + element))
      console.log(newDate)
      if (Date.now() > new Date(newDate)) {
        result = await getWeather(location, countryCode, stateCode, newDate)
      } else {
        result = await getWeather(location, countryCode, stateCode, undefined, newDate)
      }
      await db.addPrevisions(location, countryCode, stateCode, result)
    })
  }

  if (result && controlResult(result, [dateS, dateE, tsDifference])) {
    console.log("Invio risultati db")
    res.status(200).send(result)
    return true
  }

  //se non ho ricevuto niente mando la richiesta all API
  result = await getWeather(location, countryCode, stateCode, dateS, dateE)

  console.log("result API: " + typeof result)


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
    if (!final.includes(element)) {
      final.push(element)
    }
  });
  return final
}

module.exports = { rWeather }