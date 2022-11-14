const mongoose = require('mongoose');

const TrackerSchema = new mongoose.Schema({
    discordUser :   {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DiscordUser'
    },
    steamUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SteamUser'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tracker', TrackerSchema);

