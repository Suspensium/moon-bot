const Button = require('../schemas/button-schema.js');

module.exports = {
    getButton: async function (id) {
        const button = await Button.findOne({ _id: id });
        return button;
    },
    getButtonUser: async function (id, user) {
        const button = await Button.findOne({ _id: id, users: user });
        return button;
    }
}