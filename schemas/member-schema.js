const { achievementSchema } = require('./achievement-schema.js');
const { itemSchema } = require('./item-schema.js');
const { Schema, model } = require('mongoose');

const memberSchema = new Schema({
    _id: String,
    username: String,
    level: Number,
    balance: Number,
    achievements: [achievementSchema],
    inventory: [itemSchema]
});

module.exports = model('Member', memberSchema);