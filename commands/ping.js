const { SlashCommandBuilder } = require("discord.js");
const { isRegisteredUser } = require("../actions/DiscordUserActions");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(CommandDescription.PING_DESC),
  async execute(interaction) {
    const isRegistered = await isRegisteredUser(interaction.user.id);
    if (isRegistered) {
      
      await interaction.reply("Pong!");
    } else {
      await interaction.reply(Messages.USER_NOT_REGISTERED);
    }
  },
};
