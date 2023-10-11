import FreeGamesModel from "../models/FreeGamesModel";

class freeGamesController {
    constructor(payload) {
        this.model = FreeGamesModel
        this.payload = payload
        this.print = console.log
        this.latestFreeGames = this.getLatestFreeGames.bind(this)
    }

    async getLatestFreeGames() {
        let recval = await this.model.find({})
        return recval
    }

    async setLatestGames(payload) {
        let recval = await this.model.find({})
        if (recval.length == 0) {
            let newEntry = new this.model(payload)
            newEntry.save()
        } else {
            let objectDeleted = await this.model.findByIdAndDelete(recval[0]._id)
            let newEntry = new this.model(payload)
            newEntry.save()
        }
    }
}

export default freeGamesController