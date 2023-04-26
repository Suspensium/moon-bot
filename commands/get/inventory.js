const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserItems } = require('../../scripts/getInfo.js');
const { userExists } = require('../../scripts/userExists.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription("Outputs user's inventory")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Guild member name')),
    async execute(interaction) {
        const user = interaction.options.getUser('user') ?? interaction.user;

        if (!(await userExists(user))) {
            await interaction.reply(`Пользователь ${user.toString()} не найден в базе данных.`);
            return;
        }
        const inventory = await getUserItems(user);

        const inventoryCard = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(user.username)
            .setThumbnail(user.avatarURL());

        for (let i = 0; i < inventory.length; i++) {
            inventoryCard.addFields({ name: `${inventory[i].name}`, value: `${inventory[i].description}` })
        }

        await interaction.reply({ embeds: [inventoryCard] });
    },
};