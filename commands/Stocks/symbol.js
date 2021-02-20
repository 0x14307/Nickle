const {
    MessageEmbed
} = require('discord.js')
const Command = require('../../class/Command')
const fetch = require('axios')

class Fetch extends Command {
    constructor(client) {
        super(client, {
            name: "symbol",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            ownerOnly: false,
            nsfw: false,
            cooldown: -1,
            description: "Searchs for tickers of a stock."
        });
    }
    async execute(message, args) {
        let priceEmbed = new MessageEmbed()
        priceEmbed.setColor(`#EFFF00`)
        priceEmbed.setTitle(`⌛ Please wait...`)
        priceEmbed.setDescription(`This can take a while.`)
        message.channel.send(priceEmbed).then(async msg => {
             await fetch(`https://finnhub.io/api/v1/search?q=${args}&token=c0o3fln48v6qah6ru6n0`).then(r => {
                for (let index = 0; index < r.data.c; index++) {
                    const element = r.data;
                    const embed = new MessageEmbed()
                        .setColor('#EFFF00')
                        .setTitle(element.count + " results" )
                        .addFields({
                            value: element.result.displaySymbol
                        }, );
                    return msg.edit(embed);
                }
            })
        })
    }
}

module.exports = Fetch;