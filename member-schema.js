const { Schema, model } = require('mongoose');

const memberSchema = new Schema({
    _id: String,
    username: String,
    level: Number,
    balance: Number
});

module.exports = model('Member', memberSchema);