const fs = require('fs');

module.exports = {
    addUser: async function (user) {
        const userId = user.id;

        userInfo[userId] = {
            username: user.username,
            level: 1,
            balance: 0
        };

        fs.writeFile('../user-info.json', JSON.stringify(userInfo), err => {
            if (err) console.error(err);
        });
    }
};