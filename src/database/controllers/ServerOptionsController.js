import ServerOptionsModel from "../models/ServerOptionsModel";

class serverOptionsController {
    constructor(payload) {
        this.model = ServerOptionsModel,
        this.payload = payload,
        this.print = console.log
    }

    async setOptions(payload) {
        let recval = await this.model.find({guildId: payload.guildId}) //This will check all records to see if the guild id recieved already exists
        if (recval.length == 0) {
            let newEntry = new this.model(payload)
            await newEntry.save()
            return true
        } else {
            await this.model.findOneAndUpdate({ guildId: payload.guildId }, { alertChannel: payload.alertChannel })
            return true
        }
    }

    async getOptions() {
        let recval = await this.model.find({})
        if (recval.length != 0) {
            return recval
        } else {
            return false
        }
    }
}

export default serverOptionsController