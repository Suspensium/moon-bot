const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute() {
        console.log('M O O N Bot is ready!');
    },
};