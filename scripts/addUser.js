const Member = require('../member-schema.js');

module.exports = {
    addUser: async function (user, level, balance) {
        const userToAdd = new Member({
            _id: user.id,
            username: user.username,
            level: level,
            balance: balance
        });

        await userToAdd.save().catch(console.error);
    }
}