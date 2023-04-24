const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAchievements } = require('../../scripts/getInfo.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('achievements')
        .setDescription("Outputs user's achievements")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }

        const achievements = await getAchievements(user);

        const achievementsCard = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.username);

        for (let i = 0; i < (await achievements).length; i++) {
            achievementsCard.addFields({ name: `${achievements[i].number}. ${achievements[i].name}`, value: `${achievements[i].description}` })
        }

        await interaction.reply({ embeds: [achievementsCard] });
    },
};