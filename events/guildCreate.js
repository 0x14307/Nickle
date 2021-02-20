const Event = require('../class/Event')

module.exports = class guildCreation extends Event {
    constructor(...args) {
        super(...args, {
            name : "guildCreate"
        })
    }
    async execute(guild) {
        await this.client.findOrCreateGuild({ guildID: guild.id });
    }
}