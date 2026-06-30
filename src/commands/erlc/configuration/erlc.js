const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("erlc")
        .setDescription("ERLC configuration panel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(client, interaction) {

        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({
                content: "Only the server owner can use this.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle("ER:LC Setup Panel")
            .setDescription("Configure your ER:LC bot settings.")
            .setColor("Blue");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("erlc_set_api")
                .setLabel("Set API Key")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("erlc_test_api")
                .setLabel("Test Connection")
                .setStyle(ButtonStyle.Success)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};
