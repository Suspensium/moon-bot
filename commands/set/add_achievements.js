const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addAchievement } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');
const { achievementExists, userHasAchievement } = require('../../scripts/achievementExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_achievements')
        .setDescription("Adds achievement to a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('achievements_index')
                .setDescription('Index of achievement(s) to add')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.channel;
        const user = interaction.options.getUser('user');
        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }
        const achievementsIds = interaction.options.getString('achievements_index').replace(/[^\d.,]+/g, ' ')
            .replace(/,/g, ' ').replace(/\s+/g, ' ').trim().split(' ');

        let achievements = [];
        for (const achievementId of achievementsIds) {
            if (!(await achievementExists(achievementId))) {
                await channel.send(`Достижение "${achievementId}" не найдено в базе данных.`);
                continue;
            }
            if (await userHasAchievement(user, achievementId)) {
                await channel.send(`У пользователя ${user.toString()} уже есть достижение "${achievementId}".`);
                continue;
            }
            achievements.push(await addAchievement(user, achievementId));
        }
        try {
            await interaction.reply(`Пользователю ${user.toString()} были засчитаны достижения: "${achievements}".`);
        } catch (error) {
            if (error.code === 10008 || error.code === 10062) {
                // Interaction timed out
                channel.send(`Пользователю ${user.toString()} были засчитаны достижения: "${achievements}".`);
            } else {
                console.error(error);
                channel.send('Произошла ошибка при выполнении команды.');
            }
        }
    },
};