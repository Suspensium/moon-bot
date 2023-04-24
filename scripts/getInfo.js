const Member = require('../schemas/member-schema.js');

module.exports = {
    getAllUsers: async function () {
        const users = await Member.find();
        return users;
    },
    getLevel: async function (user) {
        const member = await Member.findOne({ _id: user.id }, { level: 1 });
        return member.level;
    },
    getBalance: async function (user) {
        const member = await Member.findOne({ _id: user.id }, { balance: 1 });
        return member.balance;
    },
    getAchievements: async function (user) {
        const member = await Member.findOne({ _id: user.id }, { achievements: 1 });
        return member.achievements;
    },
}