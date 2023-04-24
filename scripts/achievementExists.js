const Member = require('../schemas/member-schema.js');
const { Achievement } = require('../schemas/achievement-schema.js');

module.exports = {
    achievementExists: async function (achievementIndex) {
        const searchedAchievement = Achievement.findOne({ number: achievementIndex });
        return (await searchedAchievement ? true : false);
    },
    userHasAchievement: async function (user, achievementIndex) {
        const searchedAchievement = await Achievement.findOne({ number: achievementIndex });
        const member = await Member.findOne({ _id: user.id, achievements: searchedAchievement }, { achievements: 1 });

        return (member ? true : false);
    }
};