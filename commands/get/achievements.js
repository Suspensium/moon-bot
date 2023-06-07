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

        const channel = interaction.channel;

        const achievements = await getAchievements(user);
        achievements.sort((a, b) => a.number - b.number);

        const embeds = [];
        let currentEmbedFields = 0;
        let currentEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.username)
            .setThumbnail(user.avatarURL());

        for (let i = 0; i < achievements.length; i++) {
            if (currentEmbedFields >= 25) {
                currentEmbedFields = 0;
                embeds.push(currentEmbed);
                currentEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(user.username)
                    .setThumbnail(user.avatarURL());
            }
            currentEmbedFields++;
            currentEmbed.addFields({ name: `${achievements[i].number}. ${achievements[i].name}`, value: `${achievements[i].description}` });
        }

        embeds.push(currentEmbed);

        try {
            for (let i = 0; i < embeds.length; i++) {
                const embed = embeds[i];
                if (i === 0) {
                    await interaction.reply({ embeds: [embed] });
                } else {
                    await interaction.followUp({ embeds: [embed] });
                }
            }
        } catch (error) {
            if (error.code === 10008 || error.code === 10062) {
                // Interaction timed out
                for (let i = 0; i < embeds.length; i++) {
                    const embed = embeds[i];
                    channel.send({ embeds: [embed] });
                }
            } else {
                console.error(error);
                channel.send('Произошла ошибка при выполнении команды.');
            }
        }
    },
};