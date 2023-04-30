const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_checkout')
        .setDescription('Creates a checkout form for guild members')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(option =>
            option.setName('currency')
                .setDescription('The amount of currency to accrue')
                .setRequired(true)),
    async execute(interaction) {
        const currency = interaction.options.getInteger('currency');

        const accrueButton = new ButtonBuilder()
            .setCustomId('accrue')
            .setLabel('Присутствовал на РТ')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(accrueButton);

        await interaction.reply({ content: `${currency}`, components: [row] });
    },
};