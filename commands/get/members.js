const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { getAllUsers } = require('../../scripts/getInfo.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription('Outputs a list of all members'),
    async execute(interaction) {
        const members = await getAllUsers();
        members.sort((a, b) => b.level - a.level);

        const embeds = [];
        let currentEmbedFields = 0;
        let currentEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('M O O N Members')
            .setThumbnail(botAvatar);

        for (let i = 0; i < members.length; i++) {
            if (currentEmbedFields >= 25) {
                currentEmbedFields = 0;
                embeds.push(currentEmbed);
                currentEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('M O O N Members')
                    .setThumbnail(botAvatar);
            }
            currentEmbedFields++;
            currentEmbed.addFields({ name: `${members[i].username}`, value: `level: ${members[i].level}, balance: ${members[i].balance}` });
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