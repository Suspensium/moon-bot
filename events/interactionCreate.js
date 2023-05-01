const { Events } = require('discord.js');
const { addBalance } = require('../scripts/accrue.js');
const { getUser, getLevel } = require('../scripts/getInfo.js');
const { userExists } = require('../scripts/userExists.js');
const { addButton, addUserToButton } = require('../scripts/addButton.js');
const { getButton, getButtonUser } = require('../scripts/getButton.js');
const { addUser } = require('../scripts/addUser.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                return console.error(`No command matching ${interaction.commandName} was found.`);
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        }

        if (interaction.isButton()) {
            if (interaction.channel.locked) {
                await interaction.reply({ content: 'Поток заблокирован.', ephemeral: true });
                return;
            }
            // daily
            if (interaction.customId === 'daily') {
                const dailyAccrue = 20;

                if (!(await userExists(interaction.user))) {
                    await addUser(interaction.user, 1, 0);
                }

                const user = await getUser(interaction.user.id);

                const lastClaimedDate = new Date(user.lastDaily).toLocaleDateString();
                const currentDate = new Date().toLocaleDateString();

                if (lastClaimedDate === currentDate) {
                    await interaction.reply({ content: 'Ты уже отмечался сегодня.', ephemeral: true });
                    return;
                }

                user.lastDaily = Date.now();
                await user.save();

                let coef = '1';
                if (user.level >= 10 && user.level < 25) coef = '1.25'; else if (user.level > 25) coef = '1.5';

                await addBalance(user, dailyAccrue);
                await interaction.reply({ content: `Ты успешно отметился сегодня, получая ${dailyAccrue} x ${coef} мункойнов.`, ephemeral: true });
                return;
            }

            // accrue
            if (interaction.customId === 'accrue') {
                if (!(await userExists(interaction.user))) {
                    await addUser(interaction.user, 1, 0);
                }

                const clickedButton = await getButton(interaction.message.id);

                if (!clickedButton) {
                    await addButton(interaction.message.id);
                }

                if (await getButtonUser(interaction.message.id, interaction.user.id)) {
                    await interaction.reply({ content: 'Ты уже отметился.', ephemeral: true });
                    return;
                }
                await addUserToButton(interaction.message.id, interaction.user.id);

                const level = await getLevel(interaction.user);
                let coef = '1';
                if (level >= 10 && level < 25) coef = '1.25'; else if (level > 25) coef = '1.5';

                await addBalance(interaction.user, interaction.message.content);
                await interaction.reply(`${interaction.user.toString()} подтвердил присутствие на РТ, получая ${interaction.message.content} x ${coef} мункойнов.`);
                return;
            }

            // register
            if (interaction.customId === 'register') {
                if (await userExists(interaction.user)) {
                    await interaction.reply({ content: `Ты уже зарегистрирован.`, ephemeral: true });
                    return;
                }
                addUser(interaction.user, 1, 0);
                await interaction.reply({ content: `Ты успешно зарегистрировался.`, ephemeral: true });
                return;
            }
        }
    },
};