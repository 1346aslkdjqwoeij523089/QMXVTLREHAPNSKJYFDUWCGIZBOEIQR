require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const commands = [];

function loadCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const full = path.join(dir, file);

        if (fs.statSync(full).isDirectory()) {
            loadCommands(full);
        } else if (file.endsWith(".js")) {
            const cmd = require(full);

            if (cmd.data) {
                commands.push(cmd.data.toJSON());
                console.log("Loaded:", cmd.data.name);
            }
        }
    }
}

// ✅ FIXED PATH
loadCommands(path.join(__dirname, "src/commands"));

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Deploying commands...");

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );

        console.log("Commands deployed.");
    } catch (err) {
        console.error(err);
    }
})();
