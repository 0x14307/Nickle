const {
    MessageEmbed
} = require('discord.js')
const Command = require('../../class/Command')
const fetch = require('axios')

class Price extends Command {
    constructor(client) {
        super(client, {
            name: "price",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            ownerOnly: false,
            nsfw: false,
            cooldown: -1,
            description: "Get a certain stocks current price."
        });
    }
    async execute(message, args) {
        let priceEmbed = new MessageEmbed()
        priceEmbed.setColor(`#EFFF00`)
        if (!args[0]) {
            priceEmbed.setTitle(`:x: Error`)
            priceEmbed.setDescription(`Please provide a price to fetch.`)
            return message.channel.send(priceEmbed)
        }
        priceEmbed.setTitle(`⌛ Loading please wait.`)
        priceEmbed.setDescription(`This can take a while.`)
        message.channel.send(priceEmbed).then(async msg => {
            await fetch(`https://finnhub.io/api/v1/quote?symbol=${args}&token=c0o3fln48v6qah6ru6n0`).then(r => {
                if (r.data.c < 1) {
                    priceEmbed.setTitle(`:x: Error`)
                    priceEmbed.setDescription(`Price for \`${args[0]}\` doesn't exist.`)
                    return msg.edit(priceEmbed)
                }
                for (let index = 0; index < r.data.c; index++) {
                    const element = r.data;
                    const embed = new MessageEmbed()
                        .setColor('#EFFF00')
                        .addFields({
                            name: 'Current Price',
                            value: element.c
                        }, {
                            name: 'High Price',
                            value: element.h
                        }, {
                            name: 'Low Price',
                            value: element.l
                        }, {
                            name: 'Previous Close Price',
                            value: element.pc
                        }, );


                    return msg.edit(embed);
                }
            })
        })
    }
}

module.exports = Price;