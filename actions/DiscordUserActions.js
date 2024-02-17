const DiscordUser = require("../model/DiscordUser");
const SteamUser = require("../model/SteamUser");
const Tracker = require("../model/Tracker");

/**
 * isRegisteredUser function checks if the user is registered or not, returns discordUser if registered, false otherwise.
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

/**
 * registerUser function registers the user and returns discordUser.
 * @param {user} user 
 * @returns {Promise}
 */
async function registerUser(user) {
  return new Promise((resolve, reject) => {
    const discordUser = new DiscordUser(user);
    console.log("DISCORDUSER: " + discordUser);
    discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  });
}

/**
 * getDiscordUserFromMongo function returns the registered discordUser object.
 * @param {discordUserID} discordUserID 
 * @returns {Promise}
 */
async function getDiscordUserFromMongo(discordUserID) {
  return new Promise((resolve, reject) => {
    DiscordUser.findOne({ id: discordUserID })
      .exec((err, discordUser) => {
        if (err) {
          reject(err);
        }
        resolve(discordUser);
      });
  });
}

async function deleteTracker(track){
  return new Promise((resolve, reject) => {
    Tracker.deleteOne(track).exec((err) => {
      if (err) {
        reject(err);
      }
      resolve(track);
    }) 
  })
}

module.exports = {
  isRegisteredUser,
  registerUser,
  getDiscordUserFromMongo,
  deleteTracker,
};