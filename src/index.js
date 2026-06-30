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

// =========================
// CLIENT (MINIMAL + SAFE)
// =========================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

// =========================
// COLLECTIONS
// =========================
client.commands = new Collection();
client.cooldowns = new Collection();

// Services
client.erlc = new APIService();

// =========================
// LOAD COMMANDS
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
// SINGLE INTERACTION HANDLER
// =========================
client.on("interactionCreate", async (interaction) => {

    try {

        // =========================
        // SLASH COMMANDS
        // =========================
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.log("Unknown command:", interaction.commandName);
                return;
            }

            console.log("Running command:", interaction.commandName);

            return await command.execute(client, interaction);
        }

        // =========================
        // BUTTONS + MODALS
        // =========================
        const interactionHandler = require("./events/interactionCreate");
        return await interactionHandler(client, interaction);

    } catch (err) {
        console.error("Interaction error:", err);

        if (!interaction.replied && !interaction.deferred) {
            try {
                await interaction.reply({
                    content: "❌ Unexpected error occurred.",
                    ephemeral: true
                });
            } catch {}
        }
    }
});

// =========================
// READY EVENT
// =========================
client.once("ready", () => {

    console.log("--------------------------------");
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Guilds: ${client.guilds.cache.size}`);
    console.log("--------------------------------");

});

// =========================
// LOGIN
// =========================
client.login(process.env.TOKEN);
