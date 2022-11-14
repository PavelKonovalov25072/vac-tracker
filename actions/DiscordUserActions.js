const DiscordUser = require("../model/DiscordUser");

function isRegisteredUser(discordUserID) {
  return new Promise((resolve, reject) => {
    DiscordUser.findOne(
      { discordUserID: discordUserID },
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

function registerUser(discordUserID, discordUsername) {
  return new Promise((resolve, reject) => {
    const discordUser = new DiscordUser({
      ID: discordUserID,
      username: discordUsername,
    });
    discordUser.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  isRegisteredUser,
  registerUser,
};
