require('dotenv').config();
const mongoose = require('mongoose');
const {prevSchema} = require('./Schema/prev.js')


const Prev = mongoose.Model('Prev', prevSchema);

async function connect(){
    try{
        await mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PSWD}@mycluster.kvsrvry.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster/Weather`);
    }catch(err){
        console.log(err);
        return;
    }
    console.log("Connect: True")
    
}

connect();