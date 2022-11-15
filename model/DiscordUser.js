const mongoose = require('mongoose');

const DiscordUserSchema = new mongoose.Schema({
    id: {
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
    },
    bot : {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: null
    },
    discriminator: {
        type: String,
        default: null
    },
    system : {
        type: Boolean,
        default: false
    },
    trackers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tracker'
    }],
    
    
});

module.exports = mongoose.model('DiscordUser', DiscordUserSchema);