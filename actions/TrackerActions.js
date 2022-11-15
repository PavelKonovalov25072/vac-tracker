require("dotenv").config();
axios = require("axios");
// const SteamUser = require("../model/SteamUser");
// const DiscordUser = require("../model/DiscordUser");
const Tracker = require("../model/Tracker");
const { addTrackersToDiscordUser } = require("./DiscordUserActions");

async function trackSteamUser(steamUser, discordUser) {
  const configuration = {
    method: "get",
    url: `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${process.env.STEAM_API_KEY}&steamids=${steamUser.steamid}`,
  };
  const response = await axios(configuration);
  if (response.data.players.length == 0) {
    return;
  }
  const player = response.data.players[0];
  const isTrackerRegistered = discordUser.trackers.find(
    (tracker) => tracker.steamid == steamUser.steamid
  );
  if (isTrackerRegistered) {
    return -1;
  }

  const tracker = new Tracker({
    discordUser: discordUser._id,
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
    })
    .catch((error) => console.log(error));
}

module.exports = {
  trackSteamUser,
};
