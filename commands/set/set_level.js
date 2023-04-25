const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setLevel } = require('../../scripts/accrue.js');
const { getLevel } = require('../../scripts/getInfo.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_level')
        .setDescription("Sets user's level")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('The amount of levels to accrue')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const level = interaction.options.getInteger('level');

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }

        await interaction.reply(`Уровень ${user.toString()} был установлен с ${await getLevel(user)} на ${await setLevel(user, level)}.`);
    },
};