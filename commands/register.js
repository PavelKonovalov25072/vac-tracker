const { SlashCommandBuilder } = require("discord.js");
const {
  isRegisteredUser,
  registerUser,
} = require("../actions/DiscordUserActions");
var sprintf = require("sprintf-js").sprintf;
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription(CommandDescription.REGISTER_DESC),
  async execute(interaction) {
    const isRegistered = await isRegisteredUser(interaction.user.id);
    if (isRegistered) {
      await interaction.reply(
        sprintf(Messages.USER_ALREADY_REGISTERED, isRegistered.username)
      );
    } else {
      const registerResult = await registerUser(interaction.user);
      if (registerResult) {
        await interaction.reply(sprintf(Messages.USER_REGISTERED, registerResult.username));
      } else {
        await interaction.reply(Messages.USER_REGISTER_FAILED);
      }
    }
  },
};
