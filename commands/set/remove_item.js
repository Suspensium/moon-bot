const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { removeItem } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');
const { itemExists, userHasItem } = require('../../scripts/itemExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove_item')
        .setDescription("Removes an item from a user")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('item_name')
                .setDescription('Name of the item to remove')
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
        if (!(await userHasItem(user, itemName))) {
            await interaction.reply(`У пользователя ${user.toString()} нет данного предмета.`);
            return;
        }

        await interaction.reply(`Предмет "${await removeItem(user, itemName)}" был удален у пользователя ${user.toString()}.`);
    },
};