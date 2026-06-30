const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const GuildRepo = require("../database/repositories/GuildRepository");

module.exports = async (client, interaction) => {

    // =========================
    // SLASH COMMANDS
    // =========================
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            return await command.execute(client, interaction);
        } catch (err) {
            console.error(err);

            if (!interaction.replied) {
                return interaction.reply({
                    content: "❌ Command error.",
                    ephemeral: true
                });
            }
        }
    }

    // =========================
    // BUTTONS
    // =========================
    if (interaction.isButton()) {

        if (interaction.customId === "erlc_set_api") {

            const modal = new ModalBuilder()
                .setCustomId("erlc_api_modal")
                .setTitle("Set ERLC API Key");

            const input = new TextInputBuilder()
                .setCustomId("api_key")
                .setLabel("Enter API Key")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(input)
            );

            return interaction.showModal(modal);
        }

        if (interaction.customId === "erlc_test_api") {

            const guild = await GuildRepo.get(interaction.guild.id);

            if (!guild?.api_key) {
                return interaction.reply({
                    content: "No API key set.",
                    ephemeral: true
                });
            }

            return interaction.reply({
                content: "✅ API key exists (connection test placeholder).",
                ephemeral: true
            });
        }
    }

    // =========================
    // MODALS
    // =========================
    if (interaction.isModalSubmit()) {

        if (interaction.customId === "erlc_api_modal") {

            const apiKey = interaction.fields.getTextInputValue("api_key");

            let guild = await GuildRepo.get(interaction.guild.id);

            if (!guild) {
                guild = await GuildRepo.create(interaction.guild.id);
            }

            await GuildRepo.setApiKey(interaction.guild.id, apiKey);

            return interaction.reply({
                content: "✅ API Key saved successfully.",
                ephemeral: true
            });
        }
    }
};
