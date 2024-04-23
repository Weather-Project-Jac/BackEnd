const dataSchema = new mongoose.Schema({
    _id: false,

})

const prevSchema = new mongoose.Schema({
    nameCity: String,
    latitude: Number,
    longitude: Number,
    daily: Boolean,
    date: String,
    data: dataSchema,
});

module.exports = {prevSchema};