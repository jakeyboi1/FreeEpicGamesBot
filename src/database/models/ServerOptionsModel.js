const mongoose = require("mongoose");

const db = process.env.MONGO_CONNECTION_STRING_servers

const serverOptionsConn = mongoose.createConnection(db)

const schema = new mongoose.Schema({
    guildId: String,
    alertChannel: String
})

export default serverOptionsConn.model("serveroptions", schema)