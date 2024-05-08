const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    _id: false,
    temperatureMax: Number,
    temperatureMin: Number
})

const dailyPrevSchema = new mongoose.Schema({
    data: dataSchema,
})

module.exports = {dailyPrevSchema};