const { SlashCommandBuilder } = require("discord.js");
const { isRegisteredUser } = require("../actions/DiscordUserActions");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");
const { getSteamUser } = require("../actions/SteamUserActions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("track")
    .setDescription(CommandDescription.TRACK_DESC)
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription(CommandDescription.TRACK_USER_DESC)
        .setRequired(true)
    ),
  async execute(interaction) {
    const isRegistered = await isRegisteredUser(interaction.user.id);
    if (isRegistered) {
      const username = interaction.options.getString("username");
      const steamUser = await getSteamUser(username);
      if (steamUser == 0) {
        await interaction.reply(Messages.USER_NOT_FOUND);
      } else {
        await interaction.reply("User" + steamUser.steamID);
      }
    } else {
      await interaction.reply(Messages.USER_NOT_REGISTERED);
    }
  },
};
