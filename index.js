//importo le librerie esterne
const express = require('express')



//definisco la porta per l'API
const port = 3000

//definisco le variabili per express
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const rWeather = express.Router()
const { rWeather } = require("./API/weather.js")
const { rUser } = require("./API/user.js")


//definisco i router
app.use("/user", rUser)
app.use("/weather", rWeather)

//apro la porta dell'API
app.listen(port, () => {
  console.log(port)
})