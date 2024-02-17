const { isRegisteredUser } = require("../actions/DiscordUserActions");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");
// const { getSteamUser } = require("../actions/SteamUserActions");
const { getTrackersWithSteam } = require("../actions/TrackerActions");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
var sprintf = require("sprintf-js").sprintf;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("untrack")
    .setDescription(CommandDescription.UNTRACK_DESC)
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription(CommandDescription.UNTRACK_USER_DESC)
        .setRequired(true)
    ),
  async execute(interaction) {
    const isRegistered = await isRegisteredUser(interaction.user.id);
    if (isRegistered) {
      const id = interaction.options.getString("id");
      const trackedUsers = await getTrackersWithSteam();
      const trackedUser = trackedUsers.find(
        (user) => user.steamUser.steamid == id
      );
      if (trackedUser) {  
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("unTrackButton_" + trackedUser._id)
            .setLabel("Перестать отслеживать")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.reply({
          content: sprintf("Вы уверены, что хотите перестать отслеживать?"),
          components: [row],
        });
      } else {
        await interaction.reply(sprintf(Messages.USER_NOT_TRACKED, username));
      }
    } else {
      await interaction.reply(Messages.USER_NOT_REGISTERED);
    }
  },
};
