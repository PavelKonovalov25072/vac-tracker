const mongoose = require('mongoose');

const DiscordUserSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true,
        unique: true
    }, 
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('DiscordUser', DiscordUserSchema);