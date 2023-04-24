const { Schema, model } = require('mongoose');

const achievementSchema = new Schema({
    _id: Schema.Types.ObjectId,
    number: String,
    name: String,
    description: String
});

module.exports = {
    achievementSchema: achievementSchema,
    Achievement: model('Achievement', achievementSchema)
}