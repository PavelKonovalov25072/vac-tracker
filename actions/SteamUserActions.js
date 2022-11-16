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
      const configuration = {
        method: "get",
        url: `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${steamString}`,
      };
      const response = await axios(configuration);
      if (response.data.response.success == 1) {
        return response.data.response.steamid;
      }
      return 0;
    }
  }

  if (isNumeric(steamString)) {
    return steamString;
  }

  if (steamString.startsWith("STEAM_")) {
    return steamidToSteam64(steamString);
  }

  const configuration = {
    method: "get",
    url: `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_API_KEY}&vanityurl=${steamString}`,
  };
  const response = await axios(configuration);
  if (response.data.response.success == 1) {
    return response.data.response.steamid;
  }
  return 0;
}

async function getSteamUser(userstring) {
  const steamID = await getSteamID(userstring);
  if (steamID == 0) {
    return 0;
  }
  const configuration = {
    method: "get",
    url: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_API_KEY}&steamids=${steamID}`,
  };
  const response = await axios(configuration);
  if (response.data.response.players.length == 0) {
    return 0;
  }

  // gelen bütün veriyi steamuser modeline atıyoruz
  const steamUser = new SteamUser(response.data.response.players[0]);
  // daha sonra mevcut değilse mongo db ye kaydediyoruz
  const steamUserFromMongo = await getSteamUserFromMongo(steamID);
  if (steamUserFromMongo == null) {
    await steamUser.save();
  }
  return steamUser; 
}

async function getSteamUserFromMongo(steamID) {
  const steamUser = await SteamUser.findOne({
    steamid: steamID,
  });
  return steamUser;
}

module.exports = {
  getSteamUser,
  getSteamUserFromMongo,
};
