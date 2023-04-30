const Member = require('../schemas/member-schema.js');
const { Item } = require('../schemas/item-schema.js');

module.exports = {
    getUser: async function (id) {
        const user = await Member.findOne({ _id: id });
        return user;
    },
    getAllUsers: async function () {
        const users = await Member.find();
        return users;
    },
    getShopItems: async function () {
        const items = await Item.find();
        return items;
    },
    getUserItems: async function (user) {
        const member = await Member.findOne({ _id: user.id }, { inventory: 1 });
        return member.inventory;
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
    getTokenLevelUps: async function (user) {
        const member = await Member.findOne({ _id: user.id }, { levelUps: 1 });
        return member.levelUps ?? 0;
    },
}