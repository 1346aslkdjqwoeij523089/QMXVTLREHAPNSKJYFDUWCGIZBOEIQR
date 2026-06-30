module.exports = async (client, interaction) => {

    try {

        // =========================
        // SLASH COMMANDS
        // =========================
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.log("Unknown command:", interaction.commandName);
                return;
            }

            console.log("Executing:", interaction.commandName);

            return await command.execute(client, interaction);
        }

        // =========================
        // BUTTONS
        // =========================
        if (interaction.isButton()) {

            if (interaction.customId === "erlc_set_api") {

                const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

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

                const GuildRepo = require("../database/repositories/GuildRepository");

                const guild = await GuildRepo.get(interaction.guild.id);

                return interaction.reply({
                    content: guild?.api_key
                        ? "✅ API key exists"
                        : "❌ No API key set",
                    ephemeral: true
                });
            }
        }

        // =========================
        // MODALS
        // =========================
        if (interaction.isModalSubmit()) {

            if (interaction.customId === "erlc_api_modal") {

                const GuildRepo = require("../database/repositories/GuildRepository");

                const apiKey = interaction.fields.getTextInputValue("api_key");

                let guild = await GuildRepo.get(interaction.guild.id);

                if (!guild) {
                    guild = await GuildRepo.create(interaction.guild.id);
                }

                await GuildRepo.setApiKey(interaction.guild.id, apiKey);

                return interaction.reply({
                    content: "✅ API Key saved",
                    ephemeral: true
                });
            }
        }

    } catch (err) {
        console.error("Interaction error:", err);

        if (!interaction.replied) {
            try {
                await interaction.reply({
                    content: "❌ Error handling interaction",
                    ephemeral: true
                });
            } catch {}
        }
    }
};
