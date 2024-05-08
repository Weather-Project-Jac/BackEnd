const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
    },
    hash: {
        type: String,
        required: true
    },
    favorites: {
        type: Array,
        default: []
    }
});


module.exports = { UserSchema };
