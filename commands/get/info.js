const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getBalance, getLevel } = require('../../scripts/getInfo.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Outputs info about user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }

        const level = getLevel(user);
        const balance = getBalance(user);

        const infoCard = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.username)
            .setThumbnail(user.avatarURL())
            .addFields(
                { name: 'Level', value: `${await level}`, inline: true },
                { name: 'Balance', value: `${await balance}`, inline: true },
            );

        await interaction.reply({ embeds: [infoCard] });
    },
};