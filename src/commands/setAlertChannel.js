const { SlashCommandBuilder } = require('discord.js');
import { PermissionFlagsBits, PermissionsBitField } from 'discord.js';
import serverOptionsController from '../database/controllers/ServerOptionsController';
// Docs for Embeds: https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setalertchannel')
		.setDescription('Bot will post updates on free games in whatever channel this command is used in.'),
	async execute(interaction) {
        let serverOpts = new serverOptionsController()
        let retval = await serverOpts.setOptions({
            guildId: interaction.guildId,
            alertChannel: interaction.channelId
        })
        if (retval) {
            if (interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
                await interaction.reply({
                    content: "Alert channel set, alerts will now be sent in this channel!",
                    ephemeral: true
                })
            } else {
                await interaction.reply({
                    content: "Not admin command failed",
                    ephemeral: true
                })
            }
        }
	},
};