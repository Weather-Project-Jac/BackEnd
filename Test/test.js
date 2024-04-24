const expect = require("chai")

describe("Test", function () {
  it("Result control", () => {
    expect(checkFive(test_string)).to.be.a("string")
  })

  it("More than 5", () => {
    expect(checkFive(123)).to.be.equals("123 is greater than 5")
  })

  it("Less than 5", () => {
    expect(checkFive(2)).to.be.equals("2 is less than 5")
  })
  it("Equal to 5", () => {
    expect(checkFive(5)).to.be.equals("5 is equal to 5")
  })

  it("Is string", () => {
    expect(checkFive("5")).to.be.equals(-1)
  })
})