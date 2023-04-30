const { Schema, model } = require('mongoose');

const buttonSchema = new Schema({
    _id: String,
    users: Array,
});

module.exports = model('Button', buttonSchema);