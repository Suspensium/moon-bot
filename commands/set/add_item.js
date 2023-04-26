const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addItem } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');
const { itemExists } = require('../../scripts/itemExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_item')
        .setDescription("Adds an item to a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('item_name')
                .setDescription('Index of the item to add')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const itemName = interaction.options.getString('item_name');

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }
        if (!(await itemExists(itemName))) {
            await interaction.reply(`Предмет не найден в базе данных.`);
            return;
        }

        await interaction.reply(`Пользователь ${user.toString()} получил предмет "${await addItem(user, itemName)}".`);
    },
};