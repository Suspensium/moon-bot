const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    price: Number,
    icon: String
});

module.exports = {
    itemSchema: itemSchema,
    Item: model('Item', itemSchema)
}