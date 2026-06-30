require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");

const APIService = require("./services/erlc/APIService");

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
client.erlc = new APIService();

// Load commands
function loadCommands(dir) {
    const folders = fs.readdirSync(dir);

    for (const folder of folders) {
        const folderPath = path.join(dir, folder);

        if (!fs.statSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".js"));

        for (const file of files) {
            const cmd = require(path.join(folderPath, file));

            if (cmd.data && cmd.execute) {
                client.commands.set(cmd.data.name, cmd);
                console.log("Loaded:", cmd.data.name);
            }
        }
    }
}

loadCommands(path.join(__dirname, "commands"));

// Interaction handler (SINGLE ONLY)
client.on("interactionCreate", async (interaction) => {

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (err) {
        console.error(err);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "Error.", ephemeral: true });
        } else {
            await interaction.reply({ content: "Error.", ephemeral: true });
        }
    }
});

// Ready
client.once("ready", () => {
    console.log("--------------------------------");
    console.log(`Logged in as ${client.user.tag}`);
    console.log("--------------------------------");
});

client.login(process.env.TOKEN);
