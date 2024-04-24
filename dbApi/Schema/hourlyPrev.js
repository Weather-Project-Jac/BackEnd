const dataSchema = new mongoose.Schema({
    _id: false,
    relativeHumidity: Number,
    apparentTemperature: Number,
    precipitationProb: Number,
    windSpeed: Number,
    temperature80m: Number,
})

const hourlyPrevSchema = new mongoose.Schema({
    cityName: String,
    latitude: Number,
    longitude: Number,
    daily: Boolean,
    date: String,
    hour: String,
    data: dataSchema,
});

module.exports = {hourlyPrevSchema};