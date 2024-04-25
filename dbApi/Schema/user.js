const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    saltRounds: { 
        type: Number, 
        default: 10 
    },
    email: { 
        type: String, required: 
        true, unique: true 
    },
    profile_image_url: { 
        type: String, 
        default: 'https://placehold.co/600x400' 
    },
    registered_at: { 
        type: Date, 
        default: Date.now 
    },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = {UserSchema};