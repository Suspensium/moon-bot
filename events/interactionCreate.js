const { Events, SnowflakeUtil } = require('discord.js');
const { addBalance } = require('../scripts/accrue.js');
const { getUser, getLevel } = require('../scripts/getInfo.js');
const { userExists } = require('../scripts/userExists.js');
const { addButton, addUserToButton } = require('../scripts/addButton.js');
const { getButton, getButtonUser } = require('../scripts/getButton.js');
const { addUser } = require('../scripts/addUser.js');
const moment = require('moment-timezone');
moment.tz.setDefault('Europe/Moscow');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                return console.error(`No command matching ${interaction.commandName} was found.`);
            }

            try {
                console.log(`User "${interaction.user.username}" executed "/${interaction.commandName}"`);
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}:\n`, error);
            }
        }

        if (interaction.isButton()) {
            console.log(`User "${interaction.user.username}" pressed "${interaction.customId}" button`);
            if (interaction.channel.locked) {
                await interaction.reply({ content: 'Поток заблокирован.', ephemeral: true });
                return;
            }

            // role
            if (interaction.customId.startsWith('role_')) {
                const roleId = interaction.customId.replace('role_', '');
                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    await interaction.reply({ content: 'Роль не найдена!', ephemeral: true });
                    return;
                }

                try {
                    await interaction.member.roles.add(role);
                    await interaction.reply({ content: `Роль "${role.name}" успешно добавлена.`, ephemeral: true });
                } catch (error) {
                    console.error('Failed to add role:\n', error);
                    await interaction.reply({ content: 'Произошла ошибка в выполнении команды.', ephemeral: true });
                }
                return;
            }

            // daily
            if (interaction.customId === 'daily') {
                const dailyAccrue = 20;
                if (!(await userExists(interaction.user))) {
                    await addUser(interaction.user, 1, 0);
                }

                const user = await getUser(interaction.user.id);
                const lastClaimedDate = user.lastDaily ? moment(user.lastDaily).tz('Europe/Moscow').format('YYYY-MM-DD') : null;
                const currentDate = moment().tz('Europe/Moscow').format('YYYY-MM-DD');

                if (lastClaimedDate === currentDate) {
                    try {
                        await interaction.reply({ content: 'Ты уже отмечался сегодня.', ephemeral: true });
                    } catch (error) {
                    console.error('Failed to add daily currency:\n', error);
                }
                    return;
                }

                user.lastDaily = moment().valueOf();
                await user.save();

                let coef = '1';
                if (user.level >= 10 && user.level < 25) coef = '1.25'; else if (user.level > 25) coef = '1.5';

                await addBalance(user, dailyAccrue);
                try {
                    await interaction.reply({ content: `Ты успешно отметился сегодня, получая ${dailyAccrue} x ${coef} мункойнов.`, ephemeral: true });
                } catch (error) {
                    console.error('Failed to add daily currency:\n', error);
                }
                return;
            }

            // accrue
            if (interaction.customId.startsWith('accrue_')) {
                const currency = interaction.customId.replace('accrue_', '');

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

                await addBalance(interaction.user, currency);
                try {
                    await interaction.reply(`${interaction.user.toString()} подтвердил присутствие на РТ, получая ${currency} x ${coef} мункойнов.`);
                } catch (error) {
                    console.error('Failed to accrue:\n', error);
                }
                return;
            }

            // register
            if (interaction.customId === 'register') {
                if (await userExists(interaction.user)) {
                    await interaction.reply({ content: `Ты уже зарегистрирован.`, ephemeral: true });
                    return;
                }

                await addUser(interaction.user, 1, 0);

                try {
                    await interaction.reply({ content: `Ты успешно зарегистрировался.`, ephemeral: true });
                } catch (error) {
                    console.error('Failed to register:\n', error);
                }
                return;
            }
        }
    },
};
