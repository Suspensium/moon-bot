const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addUser } = require('../../scripts/addUser.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_user')
        .setDescription('Adds user to a database')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Starting level'))
        .addIntegerOption(option =>
            option.setName('balance')
                .setDescription('Starting balance')),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const level = interaction.options.getInteger('level') ?? 1;
        const balance = interaction.options.getInteger('balance') ?? 0;

        if ((await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} уже в базе данных.`);
            return;
        }

        addUser(user, level, balance).then(() => interaction.reply(`Пользователь ${user.toString()} был добавлен в базу данных.`));
    },
};