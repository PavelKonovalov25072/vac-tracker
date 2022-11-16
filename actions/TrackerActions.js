require("dotenv").config();
axios = require("axios");
const Messages = require("../constants/Messages");
// const SteamUser = require("../model/SteamUser");
// const DiscordUser = require("../model/DiscordUser");
const Tracker = require("../model/Tracker");
const { addTrackersToDiscordUser } = require("./DiscordUserActions");
var sprintf = require("sprintf-js").sprintf;

async function getTrackerFromSteamID(steamID) {
  const tracker = await Tracker.findOne({
    steamid: steamID,
  });
  if (tracker == null) {
    return null;
  }
  return tracker;
}

async function trackSteamUser(steamUser, discordUser, interaction) {
  const isTrackerRegisteredToMongoDb = await getTrackerFromSteamID(
    steamUser.steamid
  );
  if (isTrackerRegisteredToMongoDb) {
    const isTrackerRegisteredToDiscordUser = discordUser.trackers.find(
      (tracker) => tracker.steamid == steamUser.steamid
    );
    if (isTrackerRegisteredToDiscordUser) {
      await interaction.update({
        content: sprintf(Messages.USER_TRACK_ALREADY, steamUser.personaname),
        components: [],
      });
      return;
    }

    await addTrackersToDiscordUser(
      discordUser,
      isTrackerRegisteredToMongoDb._id
    );
    await interaction.update({
      content: sprintf(Messages.USER_TRACK_NOW, steamUser.personaname),
      components: [],
    });
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
      return;
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
        addTrackersToDiscordUser(discordUser, result._id);
        interaction.update({
          content: sprintf(Messages.USER_TRACK_NOW, steamUser.personaname),
          components: [],
        });
      })
      .catch((error) => console.log(error));
  }
}

module.exports = {
  trackSteamUser,
};
