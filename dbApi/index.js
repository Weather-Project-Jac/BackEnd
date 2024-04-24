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

async function addPrevison(object){
    const Model = mongoose.Model("a", prevSchema);
    await Model.create({
        nameCity
    })
}

db.mongoose = mongoose;
db.prevSchema = prevSchema;
db.connect = connect;
db.addPrevision = addPrevison;

module.exports = db;