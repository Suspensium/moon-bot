const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_daily')
        .setDescription('Creates a daily accrue button')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const daily = new ButtonBuilder()
            .setCustomId('daily')
            .setLabel('Отметиться')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(daily);

        await interaction.reply({ components: [row] });
    },
};