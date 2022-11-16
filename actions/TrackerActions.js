require("dotenv").config();
axios = require("axios");
const Messages = require("../constants/Messages");
// const SteamUser = require("../model/SteamUser");
// const DiscordUser = require("../model/DiscordUser");
const Tracker = require("../model/Tracker");
const { addTrackersToDiscordUser } = require("./DiscordUserActions");
var sprintf = require("sprintf-js").sprintf;

async function getTrackerFromSteamID(steamID) {
  return new Promise((resolve, reject) => {
    Tracker.findOne({ steamid: steamID }).exec((err, tracker) => {
      if (err) {
        reject(err);
      }
      resolve(tracker);
    });
  });
}

async function trackSteamUser(steamUser, discordUser, interaction) {
  const tracker = await getTrackerFromSteamID(steamUser.steamid);
  if (tracker) {
    const isTrackerRegisteredToDiscordUser = discordUser.trackers.find(
      (tracker) => tracker.steamid == steamUser.steamid
    );
    if (isTrackerRegisteredToDiscordUser) {
      await interaction.update({
        content: sprintf(Messages.USER_TRACK_ALREADY, steamUser.personaname),
        components: [],
      });
    } else {
      const result = await addTrackersToDiscordUser(discordUser, tracker._id);
      if (result) {
        await interaction.update({
          content: sprintf(Messages.USER_TRACK_NOW, steamUser.personaname),
          components: [],
        });
      } else {
        await interaction.update({
          content: Messages.USER_TRACK_FAILED,
          components: [],
        });
      }
    }
  } else {
    const configuration = {
      method: "get",
      url: `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${process.env.STEAM_API_KEY}&steamids=${steamUser.steamid}`,
    };
    const response = await axios(configuration);
    const player = response.data.players[0];

    const isTrackerRegisteredToDiscordUser = discordUser.trackers.find(
      (tracker) => tracker.steamid == steamUser.steamid
    );
    if (isTrackerRegisteredToDiscordUser) {
      await interaction.update({
        content: sprintf(Messages.USER_TRACK_ALREADY, steamUser.personaname),
        components: [],
      });
    } else {
      if (player.VACBanned) {
        await interaction.update({
          content: sprintf(
            Messages.USER_BANNED_ALREADY,
            steamUser.personaname,
            steamUser.steamid,
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
            addTrackersToDiscordUser(discordUser, result._id);
            interaction.update({
              content: sprintf(Messages.USER_TRACK_NOW, steamUser.personaname),
              components: [],
            });
          })
          .catch((error) => console.log(error));
      }
    }
  }
}

async function getTrackersWithSteam(discordUser) {
  return new Promise((resolve, reject) => {
    Tracker.find({ _id: { $in: discordUser.trackers } })
      .populate("steamUser")
      .exec((err, trackers) => {
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
};
