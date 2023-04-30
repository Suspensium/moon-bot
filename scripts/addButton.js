const Button = require('../schemas/button-schema.js');

module.exports = {
    addButton: async function (id) {
        const buttonToAdd = new Button({
            _id: id,
            users: []
        });

        await buttonToAdd.save().catch(console.error);
    },
    addUserToButton: async function (buttonId, userId) {
        const button = await Button.findOne({ _id: buttonId });
        button.users.push(userId);
        await button.save();
    },
}