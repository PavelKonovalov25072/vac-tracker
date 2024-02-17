const mongoose = require("mongoose");

const SteamUserSchema = new mongoose.Schema({
  steamid: {
    type: String,
    required: true,
    unique: true,
  },
  personaname: {
    type: String,
    required: true,
  },
  profileurl: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  avatarmedium: {
    type: String,
    required: true,
  },
  avatarfull: {
    type: String,
    required: true,
  },
  avatarhash: {
    type: String,
    required: true,
  },
  personastate: {
    type: Number,
  },
  communityvisibilitystate: {
    type: Number,
  },
  profilestate: {
    type: Number,
  },
  lastlogoff: {
    type: Number,
  },
  commentpermission: {
    type: Number,
  },
  realname: {
    type: String,
  },
  primaryclanid: {
    type: String,
  },
  timecreated: {
    type: Number,
  },
  cityid: {
    type: Number,
  },
  loccountrycode: {
    type: String,
  },
  locstatecode: {
    type: String,
  },
  loccityid: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  group: {
    type: Number
  }
  
});

module.exports = mongoose.model("SteamUser", SteamUserSchema);
