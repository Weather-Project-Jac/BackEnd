//importo le librerie esterne
var bcrypt = require('bcryptjs');
const express = require('express')

//importo i file necessari 
const { getWeather } = require("./WeatherApi/index.js")
const { mailValidation } = require("./Validation/email.js")
const { passwordValidation } = require("./Validation/password.js")
const { db } = require("./dbApi/index.js")

//definisco la porta per l'API
const port = 3000

//definisco le variabili per express
const app = express()
const rUser = express.Router()
const rWeather = express.Router()

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

  console.log(date)

  //recupero di dati dal db
  await db.connect()
  try {
    result = await db.findWeather(location, date)
  } catch (error) {
    console.log(error)
  }

  //controllo se i dati che ho ricercato sono stati trovati
  if (result) {
    res.status(200).send(result)
    return true
  }

  //recupero i dati dal API
  result = await getWeather(location)
  console.log("test")
  console.log(result)

  //li salvo nel db
  await db.addPrevisions(location, result)

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
  }

  let result = undefined


  await db.connect()

  //recupero i dati dal db
  result = await db.findWeather(location, dateE, dateS)

  //controllo se ho ricevuto qualcosa
  if (result != undefined) {
    res.status(200).send(result)
    return true
  }

  //se non ho ricevuto niente mando la richiesta all API
  result = await getWeather(location, dateS, dateE)
  await db.addPrevisions(result)
  res.status(200).send(result)
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
    res.status(500).send("Password inserita non abbastanza sicura, deve avere tra i 6 e i 15 caratteri, avere caratteri speciali (@,!,$,%), avere numeri e lettere maiuscole")
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

//definisco i router
app.use("/user", rUser)
app.use("/weather", rWeather)

//apro la porta dell'API
app.listen(port, () => {
  console.log(port)
})