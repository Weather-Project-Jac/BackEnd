const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: false,
    temperatureMax: Number,
    temperatureMin: Number,
    relativeHumidity: Number,
    apparentTemperature: Number,
    precipitationProb: Number,
    windSpeed: Number,
    temperature80m: Number,
})

const PrevisionSchema = new mongoose.Schema({
    cityName: String,
    countryCode: String,
    stateCode: String,
    latitude: Number,
    longitude: Number,
    daily: Boolean,
    date: String,
    hour: String,
    data: dataSchema,
})

module.exports = { PrevisionSchema }