const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { isRegisteredUser } = require("../actions/DiscordUserActions");
const { getTrackersWithSteam } = require("../actions/TrackerActions");
const { getPassingTime } = require("../utils/DateUtils");
var sprintf = require("sprintf-js").sprintf;
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tracklist")
    .setDescription(CommandDescription.TRACKLIST_DESC),
  async execute(interaction) {
    const isRegistered = await isRegisteredUser(interaction.user.id);
    if (isRegistered) {
      const trackedUsers = await getTrackersWithSteam(isRegistered);
      if (trackedUsers.length > 0) {
        var message = sprintf(Messages.TRACKLIST, trackedUsers.length);
        trackedUsers.forEach((user) => {
          if (user.isBanned == true) {
            message += sprintf(
              Messages.TRACKLIST_USER_BANNED,
              user.steamUser.personaname,
              user.steamUser.steamid,
              getPassingTime(user.bannedAt)
            );
          } else {
            message += sprintf(
              Messages.TRACKLIST_USER,
              user.steamUser.personaname,
              user.steamUser.steamid
            );
          }
        });
        const exampleEmbed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(isRegistered.username + "'ın takip ettiği kullanıcılar")
          .setDescription(message)
          .setFooter({
            text: "SteamStats",
            iconURL:
              "https://cdn.discordapp.com/avatars/984541763710632027/80256ec835ef3a394d1e6d0aa7399e08.png",
          })
          .setTimestamp();
        await interaction.reply({ embeds: [exampleEmbed] });
      } else {
        await interaction.reply(Messages.TRACKLIST_EMPTY);
      }
    } else {
      await interaction.reply(Messages.USER_NOT_REGISTERED);
    }
  },
};
