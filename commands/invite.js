const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const CommandDescription = require("../constants/CommandDescription");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription(CommandDescription.INVITE_DESC),
  async execute(interaction) {
    const invitEmbed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Нажмите, чтобы пригласить!")
      .setURL(
        "https://discord.com/api/oauth2/authorize?client_id=984541763710632027&permissions=8&scope=bot"
      )

      .setFooter({
        text: "SteamStats",
        iconURL:
          "https://cdn.discordapp.com/avatars/984541763710632027/80256ec835ef3a394d1e6d0aa7399e08.png",
      })
      .setTimestamp();
    await interaction.reply({ embeds: [invitEmbed] });
  },
};
