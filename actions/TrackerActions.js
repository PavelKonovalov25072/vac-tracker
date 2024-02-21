require("dotenv").config();
axios = require("axios");
const Messages = require("../constants/Messages");
// const SteamUser = require("../model/SteamUser");
// const DiscordUser = require("../model/DiscordUser");
const Tracker = require("../model/Tracker");
const {
  deleteTracker,
  deleteAllTrackers,
} = require("./DiscordUserActions");
var sprintf = require("sprintf-js").sprintf;

async function getTrackerFromSteamID(steamId) {
  return new Promise((resolve, reject) => {
    Tracker.findOne({ steamid: steamId }).exec((err, tracker) => {
      if (err) {
        reject(err);
      }
      resolve(tracker);
    });
  });
}

async function trackSteamUser(steamUser, interaction) {
  // console.log(interaction);
  const tracker = await getTrackerFromSteamID(steamUser.steamid);
  if (tracker) {
    await interaction.update({
      content: sprintf(Messages.USER_TRACK_ALREADY, steamUser.personaname),
      components: [],
    });
  } else {
    const configuration = {
      method: "get",
      url: `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${process.env.STEAM_API_KEY}&steamids=${steamUser.steamid}`,
    };
    const response = await axios(configuration);
    const player = response.data.players[0];
    // player.VACBanned
    if (player.VACBanned) {
      await interaction.update({
        content: sprintf(
          Messages.USER_BANNED_ALREADY,
          steamUser.personaname,
          steamUser.steamid,
          steamUser.group,
          player.DaysSinceLastBan
        ),
        components: [],
      });
    } else {
      const tracker = new Tracker({
        steamUser: steamUser._id,
        steamid: steamUser.steamid,
        CommunityBanned: player.CommunityBanned,
        VACBanned: player.VACBanned,
        NumberOfVACBans: player.NumberOfVACBans,
        DaysSinceLastBan: player.DaysSinceLastBan,
        NumberOfGameBans: player.NumberOfGameBans,
        EconomyBan: player.EconomyBan,
        isBanned: player.VACBanned,
      });
      tracker
        .save()
        .then((result) => {
          interaction.update({
            content: sprintf(Messages.USER_TRACK_NOW, steamUser.personaname),
            components: [],
          });
        })
        .catch((error) => console.log(error));
    }
  }
}

async function getTrackersWithSteam() {
  return new Promise((resolve, reject) => {
    Tracker.find({})
      .populate("steamUser")
      .exec((err, trackers) => {
        if (err) {
          reject(err);
        }
        resolve(trackers);
      });
  });
}

async function getTrackerObjectFromMongo_WithSteam(trackerID) {
  return new Promise((resolve, reject) => {
    Tracker.findOne({ _id: trackerID })
      .populate("steamUser")
      .exec((err, tracker) => {
        if (err) {
          reject(err);
        }
        resolve(tracker);
      });
  });
}

async function unTrackSteamUser(track, interaction) {
  deleteTracker(track).then((result) => {
    if (result) {
      interaction.update({
        content: sprintf(
          Messages.USER_UNTRACK_NOW,
          track.steamUser.personaname
        ),
        components: [],
      });
    } else {
      console.log("Failed to delete");
    }
  });
}

async function unTrackAllSteamUsers(interaction) {
  deleteAllTrackers().then((result) => {
    if (result) {
      interaction.update({
        content: sprintf(
          Messages.USER_UNTRACKALL_NOW,
        ),
        components: [],
      });
    } else {
      console.log("Failed to delete");
    }
  });
}

async function getCountOfBannedTrackers(){
  return new Promise((resolve, reject) => {
    Tracker.find({ isBanned: true }).countDocuments((err, count) => {
      if (err) {
        reject(err);
      }
      resolve(count);
    });
  });
}

async function getBannedSteamUsers(){
  return new Promise((resolve, reject) => {
    Tracker.find({ isBanned: true }).populate("steamUser").exec((err, trackers) => {
      if (err) {
        reject(err);
      }
      resolve(trackers);
    });
  });
}

module.exports = {
  trackSteamUser,
  getTrackersWithSteam,
  unTrackSteamUser,
  getTrackerObjectFromMongo_WithSteam,
  getCountOfBannedTrackers,
  getBannedSteamUsers,
  unTrackAllSteamUsers,
};
