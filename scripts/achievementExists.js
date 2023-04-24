const { Achievement } = require('../schemas/achievement-schema.js');

module.exports = {
    achievementExists: async function (achievementIndex) {
        const searchedAchievement = Achievement.findOne({ number: achievementIndex });
        return (await searchedAchievement ? true : false);
    }
};