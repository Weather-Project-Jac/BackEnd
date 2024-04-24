require('dotenv').config();
const mongoose = require('mongoose');
const {prevSchema} = require('./Schema/prev.js')

let db = {}; 


async function connect(){
    try{
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PSWD}@mycluster.kvsrvry.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster/Weather`);
    }catch(err){
        console.log(err);
        return;
    }
    console.log("Connect: True")
    
}

async function addHourly(lat, lon, object){
    const Model = mongoose.Model("a", prevSchema);
    for(let i of object.time){
        await Model.create({
            latitude: lat,
            longitude: lon,
            daily: true,
            date: "",
            data: {
                temperature: object
            }
        })
    }
}

async function addPrevisons(object){
    await addHourly(object.Hourly);
}

db.mongoose = mongoose;
db.prevSchema = prevSchema;
db.connect = connect;
db.addPrevision = addPrevisons;

module.exports = db;