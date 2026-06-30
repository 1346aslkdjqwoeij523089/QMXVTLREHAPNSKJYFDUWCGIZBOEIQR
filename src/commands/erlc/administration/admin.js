const {
    SlashCommandBuilder,
    PermissionFlagsBits,
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

        const player = interaction.options.getString("player");

        // Check custom permission system
        const allowed = await client.permissionManager.hasPermission(
            interaction.member,
            "erlc.admin"
        );

        if (!allowed) {
            return interaction.reply({
                content: "❌ You do not have permission to use this command.",
                ephemeral: true
            });
        }

        try {

            // Executes ":admin <player>"
            await client.erlc.runCommand(
                interaction.guild.id,
                `admin ${player}`
            );

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("Administrator Granted")
                .setDescription(`Successfully granted **Administrator** to **${player}**.`)
                .setTimestamp();

            await interaction.reply({
                embeds: [embed]
            });

            // Log action
            await client.logger.command({
                guild: interaction.guild.id,
                user: interaction.user.id,
                command: "admin",
                arguments: player,
                success: true
            });

        } catch (error) {

            console.error(error);

            await interaction.reply({
                content: "❌ Failed to execute the ER:LC command.",
                ephemeral: true
            });

        }

    }
};
