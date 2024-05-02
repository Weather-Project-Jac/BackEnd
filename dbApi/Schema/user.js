const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profile_image_url: {
        type: String,
        default: 'https://placehold.co/600x400'
    },
    registered_at: {
        type: Date,
        default: Date.now
    },
    salt: {
        type: String,
        default: 10
    },
    hash: {
        type: String,
        required: true
    }
});


module.exports = { UserSchema };
