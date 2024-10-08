import axios from 'axios'
import { EmbedBuilder  } from'discord.js'
import _ from 'lodash'
import freeGamesController from '../database/controllers/FreeGamesController';
import serverOptionsController from '../database/controllers/ServerOptionsController';

class EpicGamesSchedule {
  constructor() {
    this.start = this.start.bind(this)
    this.checkForFreeGames = this.checkForFreeGames.bind(this)
    this.database = new freeGamesController()
    this.print = console.log
    this.serverOptionsController = new serverOptionsController()

    this.config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions',
        headers: {}
    };
    
    this.gameExclusionList = [ 'PAYDAY 2' ];
    this.directory = process.env.EPIC_GAMES_DATA_PATH

    this.TIME = 300000 * 6 //5 minutes in ms
  }
  
  async start(client) {
    // Run the check
    await this.checkForFreeGames(client)
    // Run the check every X 
    setInterval(async () => {
        await this.checkForFreeGames(client)
    }, this.TIME);
  }

    async checkForFreeGames(client) {
        // Call data and then check that the data was properly received
        let { data: freeGamesPromo } = await axios.request(this.config)
        if (!freeGamesPromo.data?.Catalog?.searchStore?.elements) {
            throw new Error("Data not found!")
        }
        let elements = freeGamesPromo.data.Catalog.searchStore.elements

        // filter out the data so we only have free games that are not in the exclusion list
        let filteredElements = elements.filter((element) => {
            return element.price.totalPrice.discountPrice <= 0 && this.gameExclusionList.findIndex((excluded) => excluded === element.title) < 0
        })

        // Check if file exists already, if not lets create one, otherwise use the file
        let epicGamesData = []
        let currentGamesData = []
        let games = await this.database.getLatestFreeGames()
        if (games.length == 0) {
            currentGamesData = []
        } else {
            currentGamesData = games[0].games
        }


        // I was going to get fancy and do a spread concat, but this is more viable for what we want here. (to know what object is new)
        let index = 0
        let length = filteredElements.length
        let newFreeGamesBool = false
        let gameString = ""
        for (index; index < length; index++) {
            let filteredElement = filteredElements[index]
            if (currentGamesData.findIndex((game) => game === filteredElement.title) < 0) {
                //Sorting the proper url only changing off of product url if its a bundle
                let url = `<https://store.epicgames.com/en-US/p/${filteredElement.urlSlug}>`
                for (let key in filteredElement.categories) {
                    if (filteredElement.categories[key].path == "bundles") {
                        url = `<https://store.epicgames.com/en-US/bundles/${filteredElement.urlSlug}>`
                    }
                }
                gameString = gameString + `- Name: ${filteredElement.title}\nLink: ${url}\n`
                newFreeGamesBool = true
                epicGamesData.push(filteredElement.title)
            }
        }
        if (newFreeGamesBool) {
            const embed = new EmbedBuilder()
            .setColor(5763719)
            .setTitle('NEW FREE GAMES!')
            .setDescription(gameString)
            .setAuthor({ name: 'Epic Alerts', iconURL: 'https://i.pinimg.com/1200x/77/44/db/7744db1ee663b8ff8d2d21cbc35dbfb4.jpg' })
            .setTimestamp()
            //This alerts a specific channel, you can change this to alert wherever you want.
            let allChannels = client.channels.cache
            let allStoredGuildOptions = await this.serverOptionsController.getOptions() //getting all db options
            allChannels.forEach(channel => {
                if (allStoredGuildOptions != false) {
                    for (let key in allStoredGuildOptions) {
                        if (channel.guildId == allStoredGuildOptions[key].guildId && channel.id == allStoredGuildOptions[key].alertChannel) { //making sure its the right channel
                            channel.send({embeds: [embed]})
                            channel.send("@everyone")
                        }
                    }
                }
            })
            console.log(epicGamesData)
            this.database.setLatestGames({ games: epicGamesData })
        }
    }
}

module.exports = EpicGamesSchedule;