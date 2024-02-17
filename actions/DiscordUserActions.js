const DiscordUser = require("../model/DiscordUser");
const SteamUser = require("../model/SteamUser");
const Tracker = require("../model/Tracker");

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

/**
 * registerUser fonksiyonu ile kullanıcıyı kayıt ediyoruz, return olarak discordUser döndürüyor.
 * @param {user} user 
 * @returns {Promise}
 */
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

/**
 * getDiscordUserFromMongo fonksiyonu ile kullanıcının kayıtlı olduğu discordUser nesnesini döndürüyoruz.
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

/* async function addTrackersToDiscordUser(discordUser, trackersID) {
  return new Promise((resolve, reject) => {
    discordUser.trackers.push(trackersID);
    discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  });
} */

/* async function subToAllTrackers(discordUser, channelId, guildId) {
  return new Promise(async (resolve, reject) => {
    const trackers = await Tracker.find({});
    for(const tracker of trackers) {
      if(discordUser.trackers.includes(tracker._id)) {
        continue;
      }
      discordUser.trackers.push(tracker._id);
      tracker.users.push({
        discordUser: discordUser._id,
        channelId: channelId,
        guildId: guildId,
      });
      tracker.save((err) => {
        if (err) {
          reject(err);
        }
        resolve(tracker);
      });
    }
    discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  })
} */

/* async function deleteTrackersFromDiscordUser(discordUser, trackersID) {
  return new Promise((resolve, reject) => {
    discordUser.trackers.pull(trackersID);
    discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  });
} */

/* async function unsubAllTrackersFromDiscordUser(discordUser) {
  return new Promise(async (resolve, reject) => {
    discordUser.trackers.forEach(async (trackerID) => {
      const tracker = await Tracker.findById(trackerID);
      tracker.users.pull({ discordUser: discordUser._id });
      tracker.save((err) => {
        if (err) {
          reject(err);
        }
        resolve(tracker);
      })
    })
    discordUser.trackers = [];
    await discordUser.save((err) => {
      if (err) {
        reject(err);
      }
      resolve(discordUser);
    });
  });
} */

module.exports = {
  isRegisteredUser,
  registerUser,
  getDiscordUserFromMongo,
  deleteTracker,
};
