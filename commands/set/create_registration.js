const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_registration')
        .setDescription('Creates a registration button')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const registrationButton = new ButtonBuilder()
            .setCustomId('register')
            .setLabel('Зарегистрироваться')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(registrationButton);

        await interaction.reply({ components: [row] });
    },
};