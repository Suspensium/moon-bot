module.exports = {
    rtAccrue: async function (user, currency) {
        let coef = 1.;
        if (userInfo[user.id].level >= 10 && userInfo[user.id].level < 20)
            coef = 1.25;
        else if (userInfo[user.id].level >= 20)
            coef = 1.5;

        if (currency < 0) coef = 1.;

        userInfo[user.id].balance += currency * coef;

        return (currency * coef);
    },
    setLevel: async function (user, level) {
        userInfo[user.id].level = level;

        return userInfo[user.id].level;
    },
    setBalance: async function (user, balance) {
        userInfo[user.id].balance = balance;

        return userInfo[user.id].balance;
    },
    addLevel: async function (user, level) {
        userInfo[user.id].level += level;

        return userInfo[user.id].level;
    },
    addBalance: async function (user, currency) {
        let coef = 1.;
        if (userInfo[user.id].level >= 10 && userInfo[user.id].level < 20)
            coef = 1.25;
        else if (userInfo[user.id].level >= 20)
            coef = 1.5;

        if (currency < 0) coef = 1.;

        userInfo[user.id].balance += currency * coef;

        return (currency * coef);
    },
}