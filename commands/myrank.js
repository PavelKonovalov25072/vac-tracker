const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { isRegisteredUser } = require("../actions/DiscordUserActions");
const { getTrackersWithSteam } = require("../actions/TrackerActions");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");
var sprintf = require("sprintf-js").sprintf;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("myrank")
    .setDescription(CommandDescription.MYRANK_DESC),
  async execute(interaction) {
    const user = await isRegisteredUser(interaction.user.id);
    if (!user) {
      interaction.reply(Messages.NOT_REGISTERED);
      return;
    }
    const trackedAccounts = await getTrackersWithSteam(user);
    if (trackedAccounts.length == 0) {
      interaction.reply(sprintf(Messages.USER_TRACKLIST_EMPTY, user.username));
      return;
    } else {
      const bannedAccountCount = trackedAccounts.filter(
        (account) => account.isBanned == true
      ).length;
      // 22 accounts, 2 banned
      // 2 * 100 / 22
      const successRate = Math.round(
        (bannedAccountCount * 100) / trackedAccounts.length
      );
      const desc = sprintf(
        Messages.MYRANK_DESC,
        trackedAccounts.length,
        bannedAccountCount,
        successRate + "%",
        "0" // TODO: 
      );
      const rankEmbed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(user.username + "'ın SteamStats Rütbesi")
        .setDescription(desc)
        .setFooter({
          text: "SteamStats",
          iconURL:
            "https://cdn.discordapp.com/avatars/984541763710632027/80256ec835ef3a394d1e6d0aa7399e08.png",
        })
        .setTimestamp();
      await interaction.reply({ embeds: [rankEmbed] });
      return;
    }
  },
};
