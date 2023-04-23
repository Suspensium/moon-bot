const { Events } = require('discord.js');
const { rtAccrue } = require('../scripts/accrue.js');
const { userExists } = require('../scripts/userExists.js');

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
            if (interaction.customId = 'accrue') {
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
                await interaction.reply(`${interaction.user.toString()} подтвердил присутствие на РТ, получая ${await rtAccrue(interaction.user, interaction.message.content)} мункойнов.`);
            }
        }
    },
};