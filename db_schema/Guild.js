const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    guildID: String,
    settings: {
        type: Object,
        default: {
            prefix: "!",
            colorEmbed: "YELLOW"
        }
    }
})
module.exports = mongoose.model('guild', guildSchema)