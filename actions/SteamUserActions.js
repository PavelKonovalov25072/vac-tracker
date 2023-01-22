require("dotenv").config();
axios = require("axios");
const SteamUser = require("../model/SteamUser");

function steamidToSteam64(steamid) {
  var steam64id = 76561197960265728n;
  var steamidparts = steamid.split(":");
  var steamID = parseInt(steamidparts[2]);
  steam64id += BigInt(steamID * 2);
  if (steamidparts[1] == "1") {
    steam64id += BigInt(1);
  }
  return steam64id;
}

function isNumeric(s) {
  return !isNaN(s - parseFloat(s));
}

async function getSteamIDFromVanity(vanity) {
  return new Promise(async (resolve, reject) => {
    const configuration = {
      method: "get",
      url: `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${vanity}`,
    };
    const response = await axios(configuration);
    if (response.data.response.success == 1) {
      resolve(response.data.response.steamid);
    } else {
      resolve(null);
    }
  });
}

async function getSteamID(steamString) {
  if (steamString.includes("https")) {
    if (steamString[-1] != "/") {
      steamString += "/";
    }
    if (steamString.includes("profiles")) {
      let steamID = steamString.split("/")[4];
      return steamID;
    }
    if (steamString.includes("id")) {
      steamString = steamString.split("/")[4];
      const steamID = await getSteamIDFromVanity(steamString);
      return steamID;
    }
  }

  if (isNumeric(steamString)) {
    return steamString;
  }

  if (steamString.startsWith("STEAM_")) {
    return steamidToSteam64(steamString);
  }

  const steamID = await getSteamIDFromVanity(steamString);
  return steamID;
}

async function getSteamUser(userstring) {
  return new Promise(async (resolve, reject) => {
    const steamID = await getSteamID(userstring);
    if (steamID == null) {
      resolve(null);
    }

    const configuration = {
      method: "get",
      url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamID}`,
    };
    const response = await axios(configuration);
    const steamUser = response.data.response.players[0];
    if (steamUser == null) {
      resolve(null);
    }

    const steamUserFromMongo = await getSteamUserFromMongo(steamID);
    if (steamUserFromMongo == null) {
      const newSteamUser = new SteamUser(steamUser);
      newSteamUser.save((err) => {
        if (err) {
          reject(err);
        }
        resolve(newSteamUser);
      });
    } else {
      resolve(steamUserFromMongo);
    }
  });
}

async function getSteamUserFromMongo(steamID) {
  return new Promise((resolve, reject) => {
    SteamUser.findOne({ steamid: steamID }).exec((err, steamUser) => {
      if (err) {
        reject(err);
      }
      resolve(steamUser);
    });
  });
}


async function getCountOfSteamUsers() {
  return new Promise((resolve, reject) => {
    SteamUser.countDocuments({}, (err, count) => {
      if (err) {
        reject(err);
      }
      resolve(count);
    });
  });
}

module.exports = {
  getSteamUser,
  getSteamUserFromMongo,
  getCountOfSteamUsers,
};



