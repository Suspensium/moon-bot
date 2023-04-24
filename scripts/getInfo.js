const Member = require('../member-schema.js');

module.exports = {
    getLevel: async function (user) {
        const member = await Member.findOne({ _id: user.id }, { level: 1 });
        return member.level;
    },
    getBalance: async function (user) {
        const member = await Member.findOne({ _id: user.id }, { balance: 1 });
        return member.balance;
    },
}