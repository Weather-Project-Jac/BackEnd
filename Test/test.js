const expect = require("chai").expect

const { mailValidation } = require("../Validation/email")
const { passwordValidation } = require("../Validation/password")
const { db } = require("../dbApi/index")


describe("Mail", function () {
  it("Result control", () => {
    let mail = ""
    expect(mailValidation(mail)).to.be.equal(false)
  })

  it("Random string", () => {
    let mail = "paw temp"
    expect(mailValidation(mail)).to.be.equal(false)
  })

  it("mail incorrect", () => {
    let mail = "paw@.com"
    expect(mailValidation(mail)).to.be.equal(false)
  })
  it("mail correct", () => {
    let mail = "paw@gmail.com"
    expect(mailValidation(mail)).to.be.equal(false)
  })
})

describe("Password", function () {
  it("Result control", () => {
    let psw = ""
    expect(passwordValidation(psw)).to.be.equal(false)
  })

  it("Only string", () => {
    let psw = "psw temp"
    expect(passwordValidation(psw)).to.be.equal(false)
  })

  it("string with number", () => {
    let psw = "psw temp123"
    expect(passwordValidation(psw)).to.be.equal(false)
  })
  it("string with special character", () => {
    let psw = "psw temp@"
    expect(passwordValidation(psw)).to.be.equal(false)
  })

  it("string correct", () => {
    let psw = "psw temA123@"
    expect(passwordValidation(psw)).to.be.equal(true)
  })
})

describe("DB", function () {
  it("Connection", async () => {
    expect(await db.connect()).to.not.be.equal(false)
  })
  // it("GetData", async () => {
  //   // expect(await db.findWeather("Bergamo")).to.be.equal(Object)
  // })
})