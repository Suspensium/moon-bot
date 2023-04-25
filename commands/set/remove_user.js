const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { removeUser } = require('../../scripts/removeUser.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove_user')
        .setDescription('Removes user from a database')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }
        removeUser(user).then(() => interaction.reply(`Пользователь ${user.toString()} был удален из базы данных.`));
    },
};