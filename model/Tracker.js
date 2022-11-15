const mongoose = require("mongoose");

const TrackerSchema = new mongoose.Schema({
  discordUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DiscordUser",
  },
  steamUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SteamUser",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastCheck: {
    type: Date,
    default: Date.now,
  },
  VACBanned: {
    type: Boolean,
    default: false,
  },
  NumberOfVACBans: {
    type: Number,
    default: 0,
  },
  DaysSinceLastBan: {
    type: Number,
    default: 0,
  },
  NumberOfGameBans: {
    type: Number,
    default: 0,
  },
  EconomyBan: {
    type: String,
    default: "none",
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  bannedAt: {
    type: Date,
    default: null,
  },
  
});

module.exports = mongoose.model("Tracker", TrackerSchema);
