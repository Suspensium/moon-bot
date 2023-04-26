const { EmbedBuilder } = require('discord.js');
const { getBalance } = require('./getInfo.js');

module.exports = {
    buildLeaderboardEmbed: async function (users, criteria) {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(botAvatar)
            .setTitle(`Leaders in ${criteria}`);

        switch (criteria) {
            case 'Level':
                for (let i = 0; i < users.length; i++) {
                    embed.addFields({ name: `${i + 1}.`, value: `${users[i].username} - ${users[i].level}` });
                }
                break;
            case 'Balance':
                for (let i = 0; i < users.length; i++) {
                    embed.addFields({ name: `${i + 1}.`, value: `${users[i].username} - ${users[i].balance}` });
                }
                break;
            case 'Achievements':
                for (let i = 0; i < users.length; i++) {
                    embed.addFields({ name: `${i + 1}.`, value: `${users[i].username} - ${users[i].achievements.length}` });
                }
                break;
            default:
                break;
        }

        return embed;
    },
    buildShopEmbed: async function (user, item) {
        const balance = await getBalance(user);
        const color = (balance < item.price) ? '#ff0000' : '#00ff00';
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setThumbnail(item.icon)
            .setTitle(`Магазин`)
            .setDescription(`Баланс ${user.username} - ${balance}`)
            .addFields({ name: `Название`, value: `${item.name}` })
            .addFields({ name: `Описание`, value: `${item.description}` })
            .addFields({ name: `Цена`, value: `${item.price}` })
            .setColor(color);

        return embed;
    }
}