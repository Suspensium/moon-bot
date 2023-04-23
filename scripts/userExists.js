module.exports = {
    userExists: async function (user) {
        return userInfo[user.id] ? true : false;
    }
};