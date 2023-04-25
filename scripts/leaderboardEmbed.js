const { EmbedBuilder } = require('discord.js');

module.exports = {
    buildEmbed: async function (users, criteria) {
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
    }
}