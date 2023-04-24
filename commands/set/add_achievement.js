const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addAchievement } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');
const { achievementExists, userHasAchievement } = require('../../scripts/achievementExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_achievement')
        .setDescription("Adds achievement to a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('achievement_index')
                .setDescription('Index of the achievement to add')
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
        if (await userHasAchievement(user, achievementIndex)) {
            await interaction.reply(`У пользователя ${user.toString()} уже есть данное достижение.`);
            return;
        }

        await interaction.reply(`Пользователю ${user.toString()} было засчитано достижение "${await addAchievement(user, achievementIndex)}".`);
    },
};