const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_role')
        .setDescription('Creates a specific role button')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('role')
                .setDescription('Role name')
                .setRequired(true)),
    async execute(interaction) {
        const inputRole = interaction.options.getString('role');
        const role = interaction.guild.roles.cache.find((r) => r.name === inputRole);

        if (!role) {
            await interaction.reply({ content: `Роль "${inputRole}" не найдена.`, ephemeral: true });
            return;
        }

        const roleButton = new ButtonBuilder()
            .setCustomId(`role_${role.id}`)
            .setLabel(`Получить роль "${inputRole}"`)
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder()
            .addComponents(roleButton);

        await interaction.reply({ components: [row] });
    },
};