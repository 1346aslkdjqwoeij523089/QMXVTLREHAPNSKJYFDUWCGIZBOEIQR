require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const commands = [];

function loadCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);

        if (fs.statSync(fullPath).isDirectory()) {
            loadCommands(fullPath);
        } else if (file.endsWith(".js")) {
            const command = require(fullPath);

            if (command.data) {
                commands.push(command.data.toJSON());
                console.log(`Loaded: ${command.data.name}`);
            }
        }
    }
}

// FIXED PATH
loadCommands(path.join(__dirname, "commands"));

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Deploying slash commands...");

        console.log({
            TOKEN: !!process.env.TOKEN,
            CLIENT_ID: process.env.CLIENT_ID,
            GUILD_ID: process.env.GUILD_ID
        });

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("Successfully deployed commands.");
    } catch (error) {
        console.error(error);
    }
})();
