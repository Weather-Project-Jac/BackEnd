const { getWeather } = require("./WeatherApi/index.js")

getWeather().then(result => {
  console.log(result)
})