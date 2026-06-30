const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const GuildRepo = require("../database/repositories/GuildRepository");

module.exports = async (client, interaction) => {

    if (!interaction.isButton()) return;

    // OPEN API KEY MODAL
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

    // TEST CONNECTION
    if (interaction.customId === "erlc_test_api") {

        const guild = await GuildRepo.get(interaction.guild.id);

        if (!guild?.api_key) {
            return interaction.reply({
                content: "No API key set.",
                ephemeral: true
            });
        }

        return interaction.reply({
            content: "API key exists (test would go here).",
            ephemeral: true
        });
    }

};

const GuildRepo2 = require("../database/repositories/GuildRepository");

module.exports = async (client, interaction) => {

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === "erlc_api_modal") {

        const apiKey = interaction.fields.getTextInputValue("api_key");

        let guild = await GuildRepo2.get(interaction.guild.id);

        if (!guild) {
            guild = await GuildRepo2.create(interaction.guild.id);
        }

        await GuildRepo2.setApiKey(interaction.guild.id, apiKey);

        return interaction.reply({
            content: "✅ API Key saved successfully.",
            ephemeral: true
        });
    }
};
