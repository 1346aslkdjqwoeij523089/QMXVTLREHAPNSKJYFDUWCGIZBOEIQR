const db = require("../connection");

class GuildRepository {

    async get(guildId) {
        const res = await db.query(
            "SELECT * FROM guilds WHERE guild_id = $1",
            [guildId]
        );
        return res.rows[0];
    }

    async create(guildId) {
        const res = await db.query(
            "INSERT INTO guilds (guild_id, prefix, api_key, ssd_enabled)
             VALUES ($1, ':', NULL, false)
             RETURNING *",
            [guildId]
        );
        return res.rows[0];
    }

    async setApiKey(guildId, apiKey) {
        await db.query(
            "UPDATE guilds SET api_key = $1 WHERE guild_id = $2",
            [apiKey, guildId]
        );
    }

    async setPrefix(guildId, prefix) {
        await db.query(
            "UPDATE guilds SET prefix = $1 WHERE guild_id = $2",
            [prefix, guildId]
        );
    }

}

module.exports = new GuildRepository();
