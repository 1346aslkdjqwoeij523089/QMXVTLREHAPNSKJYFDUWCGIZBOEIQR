const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("erlc-admin")
        .setDescription("Grant ER:LC administrator permissions.")
        .addStringOption(option =>
            option
                .setName("player")
                .setDescription("Roblox username or UserId")
                .setRequired(true)
        ),

    category: "Administration",
    permission: "erlc.admin",

    async execute(client, interaction) {

        // ✅ FIX #1: prevent timeout ("application did not respond")
        await interaction.deferReply();

        const player = interaction.options.getString("player");

        try {

            // Optional safety check
            const allowed = await client.permissionManager.hasPermission(
                interaction.member,
                "erlc.admin"
            );

            if (!allowed) {
                return interaction.editReply({
                    content: "❌ You do not have permission to use this command."
                });
            }

            // ✅ FIX #2: protect slow API calls
            await Promise.race([
                client.erlc.runCommand(
                    interaction.guild.id,
                    `admin ${player}`
                ),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("ERLC timeout")), 8000)
                )
            ]);

            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("Administrator Granted")
                .setDescription(`Successfully granted **Administrator** to **${player}**.`)
                .setTimestamp();

            return interaction.editReply({
                embeds: [embed]
            });

        } catch (error) {

            console.error("ERLC COMMAND ERROR:", error);

            return interaction.editReply({
                content: "❌ Failed to execute ER:LC command (API error or timeout)."
            });

        }
    }
};
