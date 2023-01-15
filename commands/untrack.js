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
        .setName("username")
        .setDescription(CommandDescription.UNTRACK_USER_DESC)
        .setRequired(true)
    ),
  async execute(interaction) {
    const isRegistered = await isRegisteredUser(interaction.user.id);
    if (isRegistered) {
      const username = interaction.options.getString("username");
      const trackedUsers = await getTrackersWithSteam(isRegistered);
      const trackedUser = trackedUsers.find(
        (user) => user.steamUser.personaname == username
      );
      if (trackedUser) {
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("unTrackButton_" + trackedUser._id)
            .setLabel("Takipden Çık!")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.reply({
          content: sprintf("Takipten çıkmak istediğine emin misin?"),
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
