require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials
} = require("discord.js");

// Services
const APIService = require("./services/erlc/APIService");

// Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ],
    partials: [
        Partials.Channel
    ]
});

// Collections
client.commands = new Collection();
client.cooldowns = new Collection();

// Services
client.erlc = new APIService();

// Temporary permission manager
client.permissionManager = {
    async hasPermission(member, permission) {
        return true;
    }
};

// Temporary logger
client.logger = {
    async command(data) {
        console.log("[COMMAND LOG]", data);
    }
};

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

            console.log(`Loaded command ${command.data.name}`);

        }

    }

}

loadCommands(commandsPath);

// =========================
// Events
// =========================

client.once("ready", () => {

    console.log("--------------------------------");
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Guilds: ${client.guilds.cache.size}`);
    console.log("--------------------------------");

});

client.on("interactionCreate", async interaction => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {

        await command.execute(client, interaction);

    } catch (error) {

        console.error(error);

        if (interaction.replied || interaction.deferred) {

            await interaction.followUp({
                content: "❌ An unexpected error occurred.",
                ephemeral: true
            });

        } else {

            await interaction.reply({
                content: "❌ An unexpected error occurred.",
                ephemeral: true
            });

        }

    }

});

// Login
client.login(process.env.TOKEN);
