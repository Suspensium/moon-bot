const { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { getAllUsers } = require('../../scripts/getInfo.js');
const { buildEmbed } = require('../../scripts/leaderboardEmbed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Outputs a list of current leaders'),
    async execute(interaction) {
        const valueSelector = new StringSelectMenuBuilder()
            .setCustomId('leaderboardCriteria')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Level')
                    .setDescription('Sort by Level')
                    .setValue('Level'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Balance')
                    .setDescription('Sort by Balance')
                    .setValue('Balance'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Achievements')
                    .setDescription('Sort by Achievements')
                    .setValue('Achievements'));

        const row = new ActionRowBuilder().addComponents(valueSelector);

        const members = await getAllUsers();
        members.sort((a, b) => b.balance - a.balance);
        let topTen = members.slice(0, 10);
        let infoCard = await buildEmbed(topTen, 'Balance');

        const sentMessage = await interaction.reply({ embeds: [infoCard], components: [row] });

        const filter = (interaction) => interaction.customId === 'leaderboardCriteria';
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 600000 });
        collector.on('collect', async (interaction) => {
            const selectedValue = interaction.values[0];
            switch (selectedValue) {
                case 'Level':
                    members.sort((a, b) => b.level - a.level);
                    break;
                case 'Balance':
                    members.sort((a, b) => b.balance - a.balance);
                    break;
                case 'Achievements':
                    members.sort((a, b) => b.achievements.length - a.achievements.length);
                    break;
                default:
                    break;
            }

            topTen = members.slice(0, 10);
            infoCard = await buildEmbed(topTen, selectedValue);
            await interaction.update({ embeds: [infoCard] });
        });
    },
};