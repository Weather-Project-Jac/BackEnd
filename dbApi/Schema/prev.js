const dataSchema = new mongoose.Schema({
    _id: false,
    temperature: Number,
    relativeHumidity: Number,
    apparentTemperature: Number,
    precipitationProb: Number,
    windSpeed: Number,
    temperature80m: Number,
    temperatureMax: Number,
    temperature: Number 
})

const prevSchema = new mongoose.Schema({
    cityName: String,
    latitude: Number,
    longitude: Number,
    daily: Boolean,
    date: String,
    data: dataSchema,
});

module.exports = {prevSchema};