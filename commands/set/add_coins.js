const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addBalance } = require('../../scripts/accrue.js');
const { getBalance } = require('../../scripts/getInfo.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_coins')
        .setDescription("Adds coins to a user's balance")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('currency')
                .setDescription('The amount of currency to accrue')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const currency = interaction.options.getInteger('currency');

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }
        await addBalance(user, currency);
        await interaction.reply(`Баланс ${user.toString()} был изменен на ${currency}. Новый баланс с учётом коэффициента: ${await getBalance(user)}.`);
    },
};