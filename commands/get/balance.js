const { SlashCommandBuilder } = require('discord.js');
const { getBalance } = require('../../scripts/getInfo.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Outputs balance of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }
        await interaction.reply(`Баланс ${user.toString()} - ${await getBalance(user)} мункойнов.`);
    },
};