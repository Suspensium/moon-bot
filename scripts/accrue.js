const Member = require('../schemas/member-schema.js');
const { Achievement } = require('../schemas/achievement-schema.js');

module.exports = {
    rtAccrue: async function (user, currency) {
        const member = await Member.findOne({ _id: user.id });

        let coef = 1.;
        if (member.level >= 10 && member.level < 20)
            coef = 1.25;
        else if (member.level >= 20)
            coef = 1.5;

        member.balance += Math.round(currency * coef);
        await member.save();

        return Math.round(currency * coef);
    },
    setLevel: async function (user, level) {
        const member = await Member.findOne({ _id: user.id });

        member.level = level;
        await member.save();

        return member.level;
    },
    setBalance: async function (user, balance) {
        const member = await Member.findOne({ _id: user.id });

        member.balance = balance;
        await member.save();

        return member.balance;
    },
    addLevel: async function (user, level) {
        const member = await Member.findOne({ _id: user.id });

        member.level += level;
        await member.save();

        return member.level;
    },
    addBalance: async function (user, currency) {
        const member = await Member.findOne({ _id: user.id });

        let coef = 1.;
        if (member.level >= 10 && member.level < 20)
            coef = 1.25;
        else if (member.level >= 20)
            coef = 1.5;

        if (currency < 0) coef = 1.;

        member.balance += Math.round(currency * coef);
        await member.save();

        return member.balance;
    },
    addAchievement: async function (user, achievementIndex) {
        const member = await Member.findOne({ _id: user.id });
        const achievement = await Achievement.findOne({ number: achievementIndex });

        try {
            member.achievements.push(achievement);
            await member.save();
        } catch (error) {
            console.log(error);
        }

        return member.achievements[member.achievements.length - 1].name;
    },
}