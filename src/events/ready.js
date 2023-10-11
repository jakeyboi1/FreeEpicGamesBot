import { Events } from 'discord.js'
import Logger from '../utils/logger'
import EpicGamesSchedule from '../schedule/epicgamesschedule'

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		let EGS = new EpicGamesSchedule()
		EGS.start(client)
		client.user.setActivity(`Notifying ${client.guilds.cache.size} servers`, {type : ActivityType.Watching});
		Logger.info(`Ready! Logged in as ${client.user.tag}`);
	},
};