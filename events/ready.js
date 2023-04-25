const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        global.botAvatar = client.user.avatarURL();
        console.log('M O O N Bot is ready!');
    },
};