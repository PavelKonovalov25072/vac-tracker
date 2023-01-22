const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Messages = require("../constants/Messages");
const CommandDescription = require("../constants/CommandDescription");
const { getCountOfSteamUsers } = require("../actions/SteamUserActions");
const { getCountOfBannedTrackers } = require("../actions/TrackerActions");
var sprintf = require("sprintf-js").sprintf;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription(CommandDescription.INFO_DESC),
  async execute(interaction) {
    const countOfSteamUsers = await getCountOfSteamUsers();
    const countOfBannedSteamAccounts = await getCountOfBannedTrackers();
    const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("SteamStats")
    .setDescription(sprintf(Messages.BOT_INFO, "SteamStats", countOfSteamUsers, countOfBannedSteamAccounts))
    .setFooter({
      text: "SteamStats",
      iconURL:
        "https://cdn.discordapp.com/avatars/984541763710632027/80256ec835ef3a394d1e6d0aa7399e08.png",
    })
    .setTimestamp();
  await interaction.reply({ embeds: [exampleEmbed] });

  },
};
