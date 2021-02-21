const Command = require('../../class/Command')
const {
    MessageEmbed
} = require('discord.js')

class About extends Command {
    constructor(client) {
        super(client, {
            name: "about",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            ownerOnly: false,
            nsfw: false,
            cooldown: -1,
            description: "About this bot."
        });
    }
    async execute(message, args, dbdata) {
        let aboutEmbed = new MessageEmbed()
        aboutEmbed.setColor(dbdata.guild.settings.colorEmbed)

        aboutEmbed.setTitle("**About Nickel**")
        aboutEmbed.setDescription(
            `> **What's Nickel?**\n\n` +
            `Nickel is a Discord bot designed to get information about stocks or more.\n\n` +
            `> **Where i can find support for this bot?**\n\n` +
            `Join (X) Discord server.\n\n` +
            `> **Who develop this bot?**\n\n` +
            `0x14307#2284\n` +
            `Yaya4#1989\n`
        )
        aboutEmbed.setFooter("Made with 💖", "https://0x14307.me/stocks.png")
        message.channel.send(aboutEmbed)
    }
}
module.exports = About;