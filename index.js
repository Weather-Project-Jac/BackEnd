const { getWeather } = require("./WeatherApi/index.js")
var bcrypt = require('bcryptjs');
const express = require('express')

const { mailValidation } = require("./Validation/email.js")
const { passwordValidation } = require("./Validation/password.js")

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
rWeather.get("/:dateStart/:dateEnd", (req, res) => {
  let dateS
  let dateE
  try {
    dateS = req.params.dateStart
    dateE = req.params.dateEnd
  } catch (error) {
    res.status(500).send(error)
    return
  }


  //TODO: controllo prima di fare la chiamata se il dato è presente nel db
  getWeather(dateS, dateE).then(result => {
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

  let hash //questa sarà la password presente nel db
  if (!bcrypt.compareSync(psw, hash)) {
    res.status(500).send("Password non corretta")
  }

  //TODO: recuperare i dati di un eventuale utente
  res.status(200).send({ "mail": mail, "psw": psw })
})

//register login
rUser.post("/", (req, res) => {
  let usr
  let mail
  let psw
  let saltRounds = bcrypt.genSaltSync(10);
  let imgProfile
  let dataRegistration

  try {
    let date = req.body

    usr = date["usr"]
    mail = date["mail"]
    psw = date["psw"]
    imgProfile = date["profile"]
    dataRegistration = date["dataR"]

  } catch (error) {
    res.status(500).send("Non sono stati mandati i dati necessare per registrare l'account")
    return
  }

  if (!mailValidation(mail)) {
    res.status(500).send("mail inviata non corretta, controllare")
    return
  }

  if (!passwordValidation(psw)) {
    res.status(500).send("Password inserita non abbastanza sicura, deve avere tra i 6 e i 15 caratteri, avere caratteri speciali (@,!,$,%), avere numberi e lettere maiuscole")
    return
  }

  //crypted password
  let hashPassword = bcrypt.hashSync(psw, salt);

  //TODO: controlla se nel db è già presente un utente con quella mail
  //TODO: crea il nuovo utente
})

app.use("/user", rUser)
app.use("/weather", rWeather)

app.listen(port, () => {
  console.log(port)
})