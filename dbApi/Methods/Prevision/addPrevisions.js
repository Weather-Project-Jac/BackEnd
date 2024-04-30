const { addDaily } = require('./addDaily.js');
const { addHourly } = require('./addHourly.js')

async function addPrevisions(cityName, object) {
    console.log(object)
    Promise.all([addHourly(cityName, object), addDaily(cityName, object)])
        .then((result) => {
            console.log("Sucess upload");
        })
        .catch((err) => {
            console.error(err);
        })
}

module.exports = { addPrevisions }