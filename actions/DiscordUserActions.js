const DiscordUser = require("../model/DiscordUser");



function isRegisteredUser(discordUserID) {
  return new Promise((resolve, reject) => {
    DiscordUser.findOne(
      { id: discordUserID },
      (err, discordUser) => {
        if (err) {
          reject(err);
        } else {
          if (discordUser) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      }
    );
  });
}

function registerUser(user) {
  return new Promise((resolve, reject) => {
    const discordUser = new DiscordUser(user);
    discordUser.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function getDiscordUserFromMongo(discordUserID) {
  const discordUser = await DiscordUser.findOne({
    id: discordUserID,
  }).populate("trackers");
  return discordUser;
}

async function addTrackersToDiscordUser(discordUserID, trackersID) {
  const discordUser = await getDiscordUserFromMongo(discordUserID);
  discordUser.trackers.push(trackersID);
  await discordUser.save();
}

module.exports = {
  isRegisteredUser,
  registerUser,
  getDiscordUserFromMongo,
  addTrackersToDiscordUser,
};
