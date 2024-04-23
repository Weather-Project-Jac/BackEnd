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


//do a login
rUser.get("/:mail/:psw", (req, res) => {
  let mail = req.params.mail
  let psw = req.params.psw

  if (mail == undefined || psw == undefined) {
    res.status(500).send("non sono state mandate mail e/o password")
    return
  }
  //TODO: recuperare i dati di un eventuale utente
})

//register login
rUser.post("/", (req, res) => {
  let date = req.body

  if (date["mail"] == undefined || date["psw"] == undefined) {
    res.send(500).send("mail o psw non inserita")
    return
  }

  //TODO: controlla se nel db è già presente un utente con quella mail
  //TODO: crea il nuovo utente
})

app.use("/user", rUser)
app.use("/weather", rWeather)

app.listen(port, () => {
  console.log(port)
})