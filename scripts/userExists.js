const Member = require('../member-schema.js');

module.exports = {
    userExists: async function (user) {
        const searchedUser = Member.findOne({ _id: user.id });
        return (await searchedUser ? true : false);
    }
};