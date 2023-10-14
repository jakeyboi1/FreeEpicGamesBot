const mongoose = require("mongoose");

const db = process.env.MONGO_CONNECTION_STRING_games

const freeGamesConn = mongoose.createConnection(db)

const schema = new mongoose.Schema({
    games: Object
})

export default freeGamesConn.model("freegames", schema) 