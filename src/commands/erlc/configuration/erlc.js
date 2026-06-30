const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("erlc")
        .setDescription("ERLC configuration panel"),

    async execute(client, interaction) {

        try {
            const embed = new EmbedBuilder()
                .setTitle("ERLC Setup Panel")
                .setDescription("Configure your ERLC bot settings")
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

            return await interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true
            });

        } catch (err) {
            console.error("ERLC command error:", err);

            if (!interaction.replied) {
                await interaction.reply({
                    content: "❌ Command failed.",
                    ephemeral: true
                });
            }
        }
    }
};
