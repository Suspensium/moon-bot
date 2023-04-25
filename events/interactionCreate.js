const { Events } = require('discord.js');
const { addBalance } = require('../scripts/accrue.js');
const { getLevel } = require('../scripts/getInfo.js');
const { userExists } = require('../scripts/userExists.js');
const { addUser } = require('../scripts/addUser.js');

let messageButtonMap = new Map();

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
            if (interaction.customId === 'accrue') {
                if (!(await userExists(interaction.user))) {
                    await interaction.reply(`Пользователь ${interaction.user.toString()} не найден в базе данных.`);
                    return;
                }

                let userClickedButton = messageButtonMap.get(interaction.message.id);
                if (!userClickedButton) {
                    userClickedButton = new Set();
                    messageButtonMap.set(interaction.message.id, userClickedButton);
                }

                if (userClickedButton.has(interaction.user.id)) {
                    return interaction.reply({ content: 'Ты уже отметился.', ephemeral: true });
                }

                userClickedButton.add(interaction.user.id);
                const level = await getLevel(interaction.user);
                let coef = '1';
                if (level >= 10 && level < 20) coef = '1.25'; else if (level > 20) coef = '1.5';

                await addBalance(interaction.user, interaction.message.content);
                await interaction.reply(`${interaction.user.toString()} подтвердил присутствие на РТ, получая ${interaction.message.content} x ${coef} мункойнов.`);
                return;
            }
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