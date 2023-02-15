const getTimeForLog = require("../common/time");
const Tracker = require("../model/Tracker");
require("dotenv").config();
const Messages = require("../constants/Messages");
var sprintf = require("sprintf-js").sprintf;

const TRACK_INTERVAL = 10000 * 60 * 60; // 10 hours
const TRACK_INTERVAL_TEST = 1000 * 60; // 1 min

const SERVICE_INTERVAL = 10000 * 60; // 10 minutes
const SERVICE_INTERVAL_TEST = 1000 * 10; // 10 sec

async function getDueTracks() {
  return new Promise((resolve, reject) => {
    Tracker.find({
      isBanned: false,
    })
      .populate("steamUser users.discordUser")
      .exec((err, trackers) => {
        if (err) {
          reject(err);
        }
        resolve(trackers);
      });
  });
}

async function trackSteamUser(track, client) {
  //   console.log(getTimeForLog() + "Tracking " + track.steamid);
  const configuration = {
    method: "get",
    url: `http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${process.env.STEAM_API_KEY}&steamids=${track.steamid}`,
  };
  const response = await axios(configuration);
  const player = response.data.players[0];
  const isBanned = player.NumberOfGameBans > 0 || player.NumberOfVACBans > 0;
  if (isBanned) {
    // console.log(getTimeForLog() + track.steamUser.personaname + " is banned");
    track.isBanned = true;
    track.bannedAt = new Date();
    track.lastCheck = new Date();
    track.save();
    const discordUser = track.users;
    discordUser.forEach((user) => {
      client.guilds
        .fetch(user.guildId)
        .then((guild) =>
          guild.channels
            .fetch(user.channelId)
            .then((channel) =>
              channel.send(
                sprintf(
                  Messages.USER_BANNED,
                  user.discordUser.id,
                  track.steamUser.personaname,
                  track.steamUser.steamid
                )
              )
            )
        );
    });
  } else {
    track.lastCheck = new Date();
    track.save();
  }
}

async function checkTracks(client) {
  const tracks = await getDueTracks();
  const dueTracks = [];
  tracks.forEach((track) => {
    const lastTrack = new Date(track.lastCheck).getTime();
    const now = new Date().getTime();
    const diff = now - lastTrack;
    if (diff > TRACK_INTERVAL) {
      dueTracks.push(track);
    }
  });
  if (dueTracks.length > 0) {
    console.log(
      getTimeForLog() +
        "There are  " +
        dueTracks.length +
        " objects that are due to follow."
    );
    dueTracks.forEach((track) => {
      trackSteamUser(track, client);
    });
  } else {
    console.log(getTimeForLog() + "No tracks to follow");
  }
}

function startService(client) {
  console.log(getTimeForLog() + "Starting Track Service");
  setInterval(() => {
    console.log(getTimeForLog() + "Checking for due tracks");
    checkTracks(client);
  }, SERVICE_INTERVAL);
}

module.exports = startService;
