const {
    MessageEmbed
} = require('discord.js')
const Command = require('../../class/Command')
const fetch = require('axios')

class Fetch extends Command {
    constructor(client) {
        super(client, {
            name: "fetch",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            ownerOnly: false,
            nsfw: false,
            cooldown: -1,
            description: "Get stocks information."
        });
    }
    async execute(message, args) {
        let fetchEmbed = new MessageEmbed()
        fetchEmbed.setColor(`#EFFF00`)
        fetchEmbed.setTitle(`⌛ Loading please wait.`)
        fetchEmbed.setDescription(`This can take a while.`)
        message.channel.send(fetchEmbed).then(async msg => {
            await fetch(`https://api.polygon.io/v2/reference/tickers?search=${args[0]}&perpage=50&page=1&apiKey=alae9s3cJueg35o9fCBRY2Ap7qzzDCV3`).then(r => {
                if (r.data.tickers.length < 1) {
                    fetchEmbed.setTitle(`:x: Error`)
                    fetchEmbed.setDescription(`Stock ${args[0]} doesn't exist.`)
                    return msg.edit(fetchEmbed)
                }
                for (let index = 0; index < r.data.tickers.length; index++) {
                    const element = r.data.tickers[index];
                    const embed = new MessageEmbed()
                        .setColor('#EFFF00')
                        .setTitle(element.name)
                        .addFields({
                            name: 'Ticker',
                            value: element.ticker
                        }, {
                            name: 'Exchange',
                            value: element.primaryExch
                        }, {
                            name: 'Currency',
                            value: element.currency
                        }, );

                    return msg.edit(embed);

                }
            })
        })
    }
}
module.exports = Fetch;