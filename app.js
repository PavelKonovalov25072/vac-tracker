require("dotenv").config();
const dbConnect = require("./db/dbConnect");
const reloadCommands = require("./reloadCommands");
const getTimeForLog = require("./common/time");
const { getSteamUserFromMongo } = require("./actions/SteamUserActions");
const { getDiscordUserFromMongo } = require("./actions/DiscordUserActions");
const { trackSteamUser } = require("./actions/TrackerActions");
const fs = require("node:fs");
const path = require("node:path");
const Messages = require("./constants/Messages");
var sprintf = require("sprintf-js").sprintf;
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commands = [];
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
    console.log(getTimeForLog() + "Loaded command: " + command.data.name);
  } else {
    console.log(
      getTimeForLog() +
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on("ready", () => {
  console.log(getTimeForLog() + `Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }
  try {
    // const filter = (i) => i.customId === "primary";
    const collector = interaction.channel.createMessageComponentCollector({
      // filter,
      time: 30000, // 30 saniye içinde tıklanması lazım yoksa kapatıyor
    });
    collector.on("collect", async (i) => {
      // i.customId starts with "trackButton_"
      if (i.customId.startsWith("trackButton_")) {
        const steamId = i.customId.split("_")[1];
        const steamUser = await getSteamUserFromMongo(steamId);
        const discordUser = await getDiscordUserFromMongo(i.user.id);
        trackSteamUser(steamUser, discordUser);
        await i.update({
          content: sprintf(Messages.USER_TRACK_NOW, steamUser.personaname),
          components: [],
        });
      }
    });

    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: Messages.COMMAND_ERROR,
      ephemeral: true,
    });
  }
});

reloadCommands(commands);
dbConnect();
client.login(process.env.DISCORD_TOKEN);
