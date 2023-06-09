const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addBalance } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_coins')
        .setDescription("Adds coins to user(s) balance")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('users')
                .setDescription('Guild member name')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('currency')
                .setDescription('The amount of currency to accrue')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.channel;
        const mentionedUsersIds = interaction.options.getString('users').match(/<@!?(\d+)>/g).map(mention => mention.replace(/[<@!>]/g, ''));
        const mentionedMembers = await interaction.guild.members.fetch({ user: mentionedUsersIds, cache: true });
        const mentionedUsers = mentionedMembers.map(member => member.user);
        let users = [];
        const currency = interaction.options.getInteger('currency');
        for (const user of mentionedUsers) {
            if (!(await userExists(user))) {
                await channel.send(`Пользователь ${user.toString()} не найден в базе данных.`);
                continue;
            }
            users.push(user.toString());
            await addBalance(user, currency);
        }
        try {
            await interaction.reply(`Баланс ${users} был изменен на ${currency}.`);
        } catch (error) {
            if (error.code === 10008 || error.code === 10062) {
                // Interaction timed out
                channel.send(`Баланс ${users} был изменен на ${currency}.`);
            } else {
                console.error(error);
                channel.send('Произошла ошибка при выполнении команды.');
            }
        }
    },
};