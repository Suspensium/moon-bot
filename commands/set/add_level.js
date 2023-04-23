const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addLevel } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_level')
        .setDescription("Adds levels to a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The amount of levels to accrue')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const level = interaction.options.getInteger('level') ?? 1;

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }
        await interaction.reply(`Уровень ${user.toString()} был повышен на ${level} до ${await addLevel(user, level)}.`);
    },
};