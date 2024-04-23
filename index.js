const { getWeather } = require("./WeatherApi/index.js")
const express = require('express')

const port = 3000

const app = express()
const rUser = express.Router()
const rWeather = express.Router()




//send today weather
rWeather.get("/", (req, res) => {

  //TODO: controllo prima di fare la chiamata se il dato è presente nel db
  getWeather().then(result => {
    res.status(200).send(result)
  })
})

//send range date weather
rWeather.get("/", (req, res) => {

  //TODO: controllo prima di fare la chiamata se il dato è presente nel db
  getWeather("date1", "date2").then(result => {
    res.status(200).send(result)
  })
})


app.use("/user", rUser)
app.use("/weather", rWeather)

app.listen(port, () => {
  console.log(port)
})