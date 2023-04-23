const { SlashCommandBuilder } = require('discord.js');
const { getLevel } = require('../../scripts/getInfo.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Outputs level of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }

        await interaction.reply(`Уровень ${user.toString()} - ${await getLevel(user)}.`);
    },
};