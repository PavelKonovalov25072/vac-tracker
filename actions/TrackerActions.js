require("dotenv").config();
axios = require("axios");
// const SteamUser = require("../model/SteamUser");
// const DiscordUser = require("../model/DiscordUser");
const Tracker = require("../model/Tracker");
const { addTrackersToDiscordUser } = require("./DiscordUserActions");

async function getTrackerFromSteamID(steamID) {
  const tracker = await Tracker.findOne({
    steamid: steamID,
  });
  return tracker;
}

async function trackSteamUser(steamUser, discordUser) {
  const isTrackerRegisteredToMongoDb = await getTrackerFromSteamID(
    steamUser.steamid
  );
  if (isTrackerRegisteredToMongoDb) {
    const isTrackerRegisteredToDiscordUser = discordUser.trackers.find(
      (tracker) => tracker.steamid == steamUser.steamid
    );
    if (isTrackerRegisteredToDiscordUser) {
      return false;
    }

    await addTrackersToDiscordUser(
      discordUser.id,
      isTrackerRegisteredToMongoDb._id
    );
    return true;
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
      return false;
    }

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
        addTrackersToDiscordUser(discordUser.id, result._id);
        return true;
      })
      .catch((error) => console.log(error));
  }
}

module.exports = {
  trackSteamUser,
};
