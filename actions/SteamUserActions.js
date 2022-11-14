require("dotenv").config();
axios = require("axios");

function steamidToSteam64(steamid) {
  console.log("steamidToSteam64");
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
  const result = getSteamID(userstring);
  if (result == 0) {
    return 0;
  }
  
  return result;
}

module.exports = {
  getSteamUser,
};
