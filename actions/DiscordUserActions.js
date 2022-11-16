const DiscordUser = require("../model/DiscordUser");

async function isRegisteredUser(discordUserID) {
  return new Promise((resolve, reject) => {
    DiscordUser.findOne({ id: discordUserID }, (err, discordUser) => {
      if (err) {
        reject(err);
      }
      if (discordUser) {
        resolve(discordUser);
      } else {
        resolve(false);
      }
    });
  });
}


async function registerUser(user) {
  return new Promise((resolve, reject) => {
    const discordUser = new DiscordUser(user);
    discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  });
}

async function getDiscordUserFromMongo(discordUserID) {
  const discordUser = await DiscordUser.findOne({
    id: discordUserID,
  }).populate("trackers");
  return discordUser;
}

async function addTrackersToDiscordUser(discordUser, trackersID) {
  discordUser.trackers.push(trackersID);
  await discordUser.save();
}

module.exports = {
  isRegisteredUser,
  registerUser,
  getDiscordUserFromMongo,
  addTrackersToDiscordUser,
};
