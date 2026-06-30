const GuildRepo = require("../../database/repositories/GuildRepository");

class APIService {

    async runCommand(guildId, command) {

        const guild = await GuildRepo.get(guildId);

        if (!guild?.api_key) {
            throw new Error("No API key set for guild.");
        }

        console.log(`[ERLC] ${command} | KEY: ${guild.api_key}`);

        return true;
    }

}

module.exports = APIService;
