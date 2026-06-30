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

    category: "administration",
    permission: "erlc.admin",

    async execute(client, interaction) {

        const player = interaction.options.getString("player");

        // IMPORTANT: prevents "This interaction failed"
        await interaction.deferReply();

        try {
            // Permission check (replace later with real system)
            const allowed = await client.permissionManager?.hasPermission?.(
                interaction.member,
                "erlc.admin"
            ) ?? true;

            if (!allowed) {
                return interaction.editReply("❌ You do not have permission.");
            }

            // Safety check for service
            if (!client.erlc || !client.erlc.runCommand) {
                return interaction.editReply("❌ ERLC service not loaded.");
            }

            // Run ERLC command
            await client.erlc.runCommand(
                interaction.guild.id,
                `:admin ${player}`
            );

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("ER:LC Admin Granted")
                .setDescription(`✅ Granted **Administrator** to **${player}**`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });

        } catch (err) {
            console.error("ERLC ADMIN ERROR:", err);

            return interaction.editReply("❌ Failed to execute ERLC command.");
        }
    }
};
