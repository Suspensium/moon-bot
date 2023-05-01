const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addLevel } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_level')
        .setDescription("Changes the level of user(s)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Guild member name')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Level to add')
                .setRequired(true)),
    async execute(interaction) {
        const mentionedUsersIds = interaction.options.getString('users').match(/<@!?(\d+)>/g).map(mention => mention.replace(/[<@!>]/g, ''));
        const mentionedMembers = await interaction.guild.members.fetch({ user: mentionedUsersIds, cache: true });
        const mentionedUsers = mentionedMembers.map(member => member.user);
        let users = [];
        const level = interaction.options.getInteger('level');
        for (const user of mentionedUsers) {
            if (!(await userExists(user))) {
                await interaction.channel.send(`Пользователь ${user.toString()} не найден в базе данных.`);
                continue;
            }
            users.push(user.toString());
            await addLevel(user, level);
        }
        await interaction.reply(`Уровень ${users} был изменен на ${level}.`);
    },
};