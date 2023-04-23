module.exports = {
    getLevel: async function (user) {
        return userInfo[user.id].level;
    },
    getBalance: async function (user) {
        return userInfo[user.id].balance;
    },
}