require("dotenv").config();
const getTimeForLog = require("./common/time");
const { REST, Routes } = require("discord.js");
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

function reloadCommands(commands) {
  console.log(getTimeForLog() + "Started refreshing application commands.");
  rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
    body: commands,
  });
  console.log(getTimeForLog() + "Successfully reloaded application commands.");
}

module.exports = reloadCommands;
