const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");
const { getBannedSteamUsers } = require("../actions/TrackerActions");
const { getPassingTime } = require("../utils/DateUtils");
var sprintf = require("sprintf-js").sprintf;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bannedlist")
    .setDescription(CommandDescription.BANNEDLIST_DESC),
  async execute(interaction) {
    const bannedUsers = await getBannedSteamUsers();
    var message = sprintf(Messages.BANNEDLİST_HEADER, bannedUsers.length);
    bannedUsers.forEach((user) => {
      message += sprintf(
        Messages.BANNEDLİST_USER,
        user.steamUser.personaname,
        user.steamUser.steamid,
        getPassingTime(user.bannedAt)
      );
    });
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("SteamStats'te uygulama başından beri ban yiyen kullanıcılar")
      .setDescription(message)
      .setFooter({
        text: "SteamStats",
        iconURL:
          "https://cdn.discordapp.com/avatars/984541763710632027/80256ec835ef3a394d1e6d0aa7399e08.png",
      })
      .setTimestamp();
    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
