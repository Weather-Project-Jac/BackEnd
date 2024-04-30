const { getWeather } = require("./WeatherApi/index.js")
var bcrypt = require('bcryptjs');
const express = require('express')

const { mailValidation } = require("./Validation/email.js")
const { passwordValidation } = require("./Validation/password.js")
const db = require("./dbApi/index.js")

const port = 3000

const app = express()
const rUser = express.Router()
const rWeather = express.Router()

//send today weather
rWeather.get("/:location", async (req, res) => {
  let location

  try {
    location = req.params.location
  } catch (error) {
    console.log(error)
  }

  let result = undefined
  let date = (new Date().toISOString()).substring(0, 10)

  await db.connect()
  result = db.findWeather(location, date)

  if (result != undefined) {
    res.status(200).send(result)
    return true
  }

  getWeather(location).then(result => {
    console.log("Prese da API")
    res.status(200).send(result)
    return true
  })
})

//send range date weather
rWeather.get("/:location/:dateStart/:dateEnd", async (req, res) => {
  let dateS
  let dateE
  let location
  try {
    dateS = req.params.dateStart
    dateE = req.params.dateEnd
    location = req.params.location
  } catch (error) {
    res.status(500).send(error)
    return
  }

  let result = undefined

  await db.connect()

  result = await db.findWeather(location, dateE, dateS)
  if (result != undefined) {
    res.status(200).send(result)
    return true
  }


  getWeather(location, dateS, dateE).then(result => {
    res.status(200).send(result)
  })
})

//do a login
rUser.get("/:mail/:psw", async (req, res) => {
  let mail = req.params.mail
  let psw = req.params.psw

  //controllo se sono stati mandati mail e password 
  if (mail == undefined || psw == undefined) {
    res.status(500).send("non sono state mandate mail e/o password")
    return
  }

  console.log(mail, psw)

  let result = undefined

  //recupero i dati utente dal db
  await db.connect()
  result = await db.findUser(psw, mail)

  console.log(result)

  let hash

  //mi assicuro che ci sia il campo hash nella risposta
  try {
    hash = result["hash"]
  } catch (error) {
    res.status(500).send("Utente non presente")
    return
  }

  //controllo la password criptata con quella inviata
  if (!bcrypt.compareSync(psw, hash)) {
    res.status(500).send("Password non corretta")
    return
  }

  //se tutto va a buon fine mando i dati al richiedente
  res.status(200).send({ "mail": mail, "psw": psw })
  return
})

//register login
rUser.post("/", async (req, res) => {
  let usr
  let mail
  let psw
  let saltRounds = bcrypt.genSaltSync(10);
  let imgProfile
  let dataRegistration

  //controllo che siano stati inviati tutti i dati richiesti
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

  //valido la mail
  if (!mailValidation(mail)) {
    res.status(500).send("mail inviata non corretta, controllare")
    return
  }

  //valido la password
  if (!passwordValidation(psw)) {
    res.status(500).send("Password inserita non abbastanza sicura, deve avere tra i 6 e i 15 caratteri, avere caratteri speciali (@,!,$,%), avere numberi e lettere maiuscole")
    return
  }

  //crypted password
  let hashPassword = bcrypt.hashSync(psw, salt);

  //controllo se esiste già un utente con quella mail nel db
  await db.connect()
  let result = await db.findUser(hashPassword, mail, usr)

  //controllo che non esista nessun utente con quella mail
  if (result.length != 0) {
    res.status(500).send("é già presente un utente con la mail " + mail)
    return
  }

  //creo un nuovo utente
  let newUser = {
    username: usr,
    email: mail,
    profile_image_url: imgProfile,
    salt: saltRounds,
    hash: psw,
    dataR: dataRegistration
  }

  //inserisco l'utente nel db
  let data = await db.registerUser(newUser)

  if (!data) {
    res.status(500).send("Utente non registrato")
    return
  }

  res.status(200).send("Utente registrato con successo")
})

app.use("/user", rUser)
app.use("/weather", rWeather)

app.listen(port, () => {
  console.log(port)
})