const Member = require('../schemas/member-schema.js');

module.exports = {
    removeUser: async function (user) {
        await Member.findOneAndDelete({ _id: user.id });
        return;
    }
};