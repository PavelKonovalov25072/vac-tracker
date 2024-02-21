const { isRegisteredUser } = require("../actions/DiscordUserActions");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
var sprintf = require("sprintf-js").sprintf;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untrack_all")
    .setDescription(CommandDescription.UNTRACK_DESC),
    
  async execute(interaction) {
    const isRegistered = await isRegisteredUser(interaction.user.id);
    if (isRegistered) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("unTrackAllButton_")
            .setLabel("Перестать отслеживать")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.reply({
            content: sprintf("Вы уверены, что хотите перестать отслеживать?"),
            components: [row],
        });
    }
    else {
      await interaction.reply(Messages.USER_NOT_REGISTERED);
    }
  },
};
