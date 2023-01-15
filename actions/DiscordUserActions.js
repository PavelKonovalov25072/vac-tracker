const DiscordUser = require("../model/DiscordUser");


/**
 * isRegisteredUser fonksiyonu ile kullanıcının kayıtlı olup olmadığını kontrol ediyoruz, return olarak varsa discordUser yoksa false döndürüyor.
 * @param {String} discordUserID
 * @returns {Promise}
 */
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
    console.log("DİSCORDUSER: " + discordUser);
    discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  });
}

async function getDiscordUserFromMongo(discordUserID) {
  return new Promise((resolve, reject) => {
    DiscordUser.findOne({ id: discordUserID })
      .populate("trackers")
      .exec((err, discordUser) => {
        if (err) {
          reject(err);
        }
        resolve(discordUser);
      });
  });
}

async function addTrackersToDiscordUser(discordUser, trackersID) {
  return new Promise((resolve, reject) => {
    discordUser.trackers.push(trackersID);
    discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  });
}

async function deleteTrackersFromDiscordUser(discordUser, trackersID) {
  return new Promise((resolve, reject) => {
    discordUser.trackers.pull(trackersID);
    discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  });
}

module.exports = {
  isRegisteredUser,
  registerUser,
  getDiscordUserFromMongo,
  addTrackersToDiscordUser,
  deleteTrackersFromDiscordUser,
};
