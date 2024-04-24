const expect = require("chai").expect

const { mailValidation } = require("../Validation/email")
const { password } = require("../Validation/password")
let mail = ""
console.log(mailValidation(mail))

describe("Test", function () {
  it("Result control", () => {
    let mail = ""
    expect(mailValidation(mail)).to.be.equal(false)
  })

  it("Only string", () => {
    let mail = "mail temp"
    expect(mailValidation(mail)).to.be.equal(false)
  })

  it("string with number", () => {
    let mail = "mail temp123"
    expect(mailValidation(mail)).to.be.equal(false)
  })
  it("string with special character", () => {
    let mail = "mail temp@"
    expect(mailValidation(mail)).to.be.equal(false)
  })

  it("string correct", () => {
    let mail = "mail temA123@"
    expect(mailValidation(mail)).to.be.equal(true)
  })
})