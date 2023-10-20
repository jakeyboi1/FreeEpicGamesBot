const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const pckg = require('../../package.json') 
// Docs for Embeds: https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor
module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Provides information about the bot.'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
        .setColor(3447003)
        .setTitle('Bot Info')
        .setDescription(pckg.description || 'Beep Bo0P')
        .addFields(
            { name: 'Enable Alerts', value: "/setalertchannel to enable alerts in a channel(alerts will be sent to whatever channel this command is used in)", inline: true },
            { name: 'Manufacturer', value: pckg.author || 'not found', inline: true },
            { name: 'Version', value: pckg.version || 'not found', inline: true },
            { name: '\u200B', value: '\u200B' }
        )
        
        
		await interaction.reply({ embeds: [ embed ], ephemeral: true });
	},
};