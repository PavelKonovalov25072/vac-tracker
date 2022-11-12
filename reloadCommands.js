require("dotenv").config();
const { REST, Routes } = require("discord.js");
const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
];
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

function reloadCommands() {
  console.log("Started refreshing application commands.");
  rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
    body: commands,
  });
  console.log("Successfully reloaded application commands.");
}

module.exports = reloadCommands;