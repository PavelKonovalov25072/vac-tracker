const { SlashCommandBuilder } = require("discord.js");
const {
  isRegisteredUser,
  registerUser,
} = require("../actions/DiscordUserActions");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription(CommandDescription.REGISTER_DESC),
  async execute(interaction) {
    const isRegistered = await isRegisteredUser(interaction.user.id);
    if (isRegistered) {
      await interaction.reply(Messages.USER_ALREADY_REGISTERED);
    } else {
      await registerUser(interaction.user);
      await interaction.reply(Messages.USER_REGISTERED);
    }
  },
};
