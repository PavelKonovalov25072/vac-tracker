const { isRegisteredUser } = require("../actions/DiscordUserActions");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");
const { getSteamUser } = require("../actions/SteamUserActions");
const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
var sprintf = require("sprintf-js").sprintf;

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
        if (steamUser.communityvisibilitystate == 3) {
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("trackButton_" + steamUser.steamid)
              .setLabel("Takip Et!")
              .setStyle(ButtonStyle.Success)
          );

          await interaction.reply({
            content: sprintf(Messages.USER_FOUND, steamUser.personaname),
            components: [row],
          });
        } else {
          await interaction.reply(
            sprintf(Messages.USER_PRIVATE, steamUser.personaname)
          );
        }
      }
    } else {
      await interaction.reply(Messages.USER_NOT_REGISTERED);
    }
  },
};
