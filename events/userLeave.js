const { Events } = require('discord.js');
const { removeUser } = require('../scripts/removeUser.js');
const { userExists } = require('../scripts/userExists.js');

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            console.log(member);
            if (userExists(member)) {
                await removeUser(member);
                console.log(`User ${member.username} was deleted from database.`);
            }
        } catch (error) {
            console.error(error);
        }
    },
};