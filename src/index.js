require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");

// Services
const APIService = require("./services/erlc/APIService");

// Client (MINIMAL INTENTS)
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// Collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Services
client.erlc = new APIService();

// =========================
// Load Commands
// =========================

const commandsPath = path.join(__dirname, "commands");

function loadCommands(directory) {

    const folders = fs.readdirSync(directory);

    for (const folder of folders) {

        const folderPath = path.join(directory, folder);

        if (!fs.statSync(folderPath).isDirectory()) continue;

        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {

            const command = require(path.join(folderPath, file));

            if (!command.data || !command.execute) continue;

            client.commands.set(command.data.name, command);

            console.log(`Loaded command: ${command.data.name}`);
        }
    }
}

loadCommands(commandsPath);

// =========================
// Interaction Handler (SINGLE SOURCE OF TRUTH)
// =========================

const interactionHandler = require("./events/interactionCreate");

client.on("interactionCreate", async (interaction) => {
    await interactionHandler(client, interaction);

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (err) {
        console.error(err);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "❌ Error executing command.",
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: "❌ Error executing command.",
                ephemeral: true
            });
        }
    }
});

// READY EVENT
client.once("ready", () => {
    console.log("--------------------------------");
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Guilds: ${client.guilds.cache.size}`);
    console.log("--------------------------------");
});

// LOGIN
client.login(process.env.TOKEN);
