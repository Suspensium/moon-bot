const Member = require('../schemas/member-schema.js');
const { Item } = require('../schemas/item-schema.js');

module.exports = {
    itemExists: async function (itemName) {
        const searchedItem = Item.findOne({ name: itemName });
        return (await searchedItem ? true : false);
    },
    userHasItem: async function (user, itemName) {
        const searchedItem = await Item.findOne({ name: itemName });
        const member = await Member.findOne({ _id: user.id, inventory: searchedItem }, { inventory: 1 });

        return (member ? true : false);
    }
};