const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: false,
    temperatureMax: Number,
    temperatureMin: Number
})

const dailyPrevSchema = new mongoose.Schema({
    cityName: String,
    countryCode: String,
    stateCode: String,
    latitude: Number,
    longitude: Number,
    daily: Boolean,
    date: String,
    data: dataSchema,
})

module.exports = {dailyPrevSchema};