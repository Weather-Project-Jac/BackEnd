var bcrypt = require('bcryptjs')
const express = require('express')
const rUser = express.Router()

//importo i file necessari 
const { mailValidation } = require("../Validation/email.js")
const { passwordValidation } = require("../Validation/password.js")
const { db } = require("../dbApi/index.js")

//do a login
rUser.post("/login", async (req, res) => {
  let mail = req.body.mail
  let psw = req.body.psw

  //controllo se sono stati mandati mail e password 
  if (mail == undefined || psw == undefined) {
    res.status(500).send("non sono state mandate mail e/o password")
    return
  }

  let result = undefined

  //recupero i dati utente dal db
  await db.connect()
  result = await db.findUser(mail)
  console.log("result:")
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
  let hashPassword = bcrypt.hashSync(psw, saltRounds);

  //controllo se esiste già un utente con quella mail nel db
  await db.connect()
  let result = await db.findUser(mail)

  console.log("result:")
  console.log(result)

  //controllo che non esista nessun utente con quella mail
  if (result != undefined) {
    res.status(500).send("é già presente un utente con la mail " + mail)
    return
  }

  //creo un nuovo utente
  let newUser = {
    username: usr,
    email: mail,
    profile_image_url: imgProfile,
    salt: saltRounds,
    hash: hashPassword,
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


module.exports = { rUser }