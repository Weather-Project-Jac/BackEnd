const mongoose = require('mongoose');

const basePrevSchema = new mongoose.Schema({
    cityName: String,
    countryCode: String,
    stateCode: String,
    latitude: Number,
    longitude: Number,
    daily: Boolean,
    date: String,
})

module.exports = { basePrevSchema }