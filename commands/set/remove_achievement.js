const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { removeAchievement } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');
const { achievementExists, userHasAchievement } = require('../../scripts/achievementExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove_achievement')
        .setDescription("Removes achievement from a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('achievement_index')
                .setDescription('Index of the achievement to remove')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const achievementIndex = interaction.options.getString('achievement_index');

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }
        if (!(await achievementExists(achievementIndex))) {
            await interaction.reply(`Достижение не найдено в базе данных.`);
            return;
        }
        if (!(await userHasAchievement(user, achievementIndex))) {
            await interaction.reply(`У пользователя ${user.toString()} нет данного достижения.`);
            return;
        }

        await interaction.reply(`Достижение "${await removeAchievement(user, achievementIndex)}" было удалено у пользователя ${user.toString()}.`);
    },
};