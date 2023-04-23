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
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if ((await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} уже в базе данных.`);
            return;
        }
        await addUser(user);
        await interaction.reply(`Пользователь ${user.toString()} был добавлен в базу данных.`);
    },
};