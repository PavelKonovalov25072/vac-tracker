const mongoose = require("mongoose");

const TrackerSchema = new mongoose.Schema({
  // artık gerek görmedim sebebi ise şu:
  // discordUser aslında ekleyen kişiyi gösteriyordu fakat bir tracker'ı ben birden fazla discordUser'a ekleyebilirim. öyle olunca çok anlamsız oluyor
  // ondan dolayı bu attribute'u sildim
  // discordUser: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "DiscordUser",
  // },
  steamUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SteamUser",
  },
  steamid : {
    type: String,
    required: true
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
