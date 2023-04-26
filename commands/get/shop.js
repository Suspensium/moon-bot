const { ActionRowBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getShopItems, getBalance, getLevel, getTokenLevelUps } = require('../../scripts/getInfo.js');
const { addBalance, addLevel, addItem, removeItem, addTokenLevelUps } = require('../../scripts/accrue.js');
const { userExists } = require('../../scripts/userExists.js');
const { buildShopEmbed } = require('../../scripts/buildEmbed.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Outputs a shop for a caller'),
    async execute(interaction) {
        const user = interaction.user;

        if (!(await userExists(user))) {
            await interaction.reply({ content: `Тебя нет в базе данных.`, ephemeral: true });
            return;
        }

        const items = await getShopItems();
        const balance = await getBalance(user);

        const shopPrevButton = new ButtonBuilder()
            .setCustomId('shop_prev')
            .setLabel('⬅')
            .setDisabled(true)
            .setStyle(ButtonStyle.Secondary);
        const shopBuyButton = new ButtonBuilder()
            .setCustomId('shop_buy')
            .setLabel('Купить')
            .setDisabled((balance < items[0].price) ? true : false)
            .setStyle(ButtonStyle.Primary);
        const shopNextButton = new ButtonBuilder()
            .setCustomId('shop_next')
            .setLabel('➡')
            .setStyle(ButtonStyle.Secondary);
        const confirmButton = new ButtonBuilder()
            .setCustomId('shop_confirm')
            .setLabel('Да')
            .setStyle(ButtonStyle.Success);
        const cancelButton = new ButtonBuilder()
            .setCustomId('shop_cancel')
            .setLabel('Отмена')
            .setStyle(ButtonStyle.Danger);

        const manipRow = new ActionRowBuilder().addComponents(shopPrevButton, shopBuyButton, shopNextButton);
        const confirmRow = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

        let index = 0;
        let embed = await buildShopEmbed(user, items[index]);

        const sentMessage = await interaction.reply({ embeds: [embed], components: [manipRow] });
        const filter = (interaction) =>
            interaction.customId === 'shop_prev' ||
            interaction.customId === 'shop_buy' ||
            interaction.customId === 'shop_next';
        const manipCollector = sentMessage.createMessageComponentCollector({ filter, time: 600000 });
        manipCollector.on('collect', async (manipInteraction) => {
            if (!(interaction.user.id === manipInteraction.user.id)) {
                await manipInteraction.reply({ content: `Этот магазин не предназначен для вас.`, ephemeral: true });
                return;
            }
            if (manipInteraction.customId === 'shop_prev') index--;
            else if (manipInteraction.customId === 'shop_next') index++;
            else {
                if (items[index].name === "Жетон выслуги" && (await getTokenLevelUps(user) >= 5)) {
                    await manipInteraction.reply({ content: `Вы уже повысили уровень 5 раз.`, ephemeral: true });
                    return;
                }
                const confirmMessage = await manipInteraction.channel.send({ content: `Вы уверены, что хотите купить "${items[index].name}"?`, components: [confirmRow] });
                const filter = (manipInteraction) =>
                    manipInteraction.customId === 'shop_confirm' ||
                    manipInteraction.customId === 'shop_cancel';
                const confirmCollector = confirmMessage.createMessageComponentCollector({ filter, time: 60000 });
                confirmCollector.on('collect', async (confirmInteraction) => {
                    if (!(interaction.user.id === confirmInteraction.user.id)) {
                        await confirmInteraction.reply({ content: `Этот магазин не предназначен для вас.`, ephemeral: true });
                        return;
                    }
                    if (confirmInteraction.customId === 'shop_cancel') await confirmMessage.delete();
                    else {
                        addBalance(user, items[index].price * (-1)).then(addItem(user, items[index].name)).then(async () => {
                            await confirmInteraction.channel.send(`Пользователь ${user.toString()} приобрел предмет "${items[index].name}" за ${items[index].price} мункойнов.`);
                        });
                        try {
                            await confirmMessage.delete();
                            await sentMessage.delete();
                        } catch (error) { console.error(error) };
                        if (items[index].name === "Жетон выслуги") {
                            addTokenLevelUps(user).then(removeItem(user, items[index].name).then(async () => {
                                await interaction.channel.send(`Пользователь ${user.toString()} повышает свой уровень с ${await getLevel(user)} до ${await addLevel(user, 1)}.`);
                            }));
                        }
                        return;
                    }
                });
            }
            manipRow.components[0].setDisabled((index === 0) ? true : false);
            manipRow.components[1].setDisabled((balance < items[index].price) ? true : false);
            manipRow.components[2].setDisabled((index === items.length - 1) ? true : false);
            embed = await buildShopEmbed(user, items[index]);
            await manipInteraction.update({ embeds: [embed], components: [manipRow] });
        });
    },
};