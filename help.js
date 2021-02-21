const { MessageEmbed } = require('discord.js')
const Command = require('../../class/Command')
const fetch = require('axios')

class Help extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            ownerOnly: false,
            nsfw: false,
            cooldown: -1,
            description: "Gives all available commands"
        });
    }
    async execute(client, message, args, dbdata) {
        let loadembed = new MessageEmbed()
        if (!args[0]) {
        }
        loadembed.setTitle(`⌛ Loading please wait.`)
        loadembed.setColor(dbdata.guild.settings.colorEmbed)
        loadembed.setDescription(`This can take a while.`)
        message.channel.send(loadembed);

        client.commands.forEach((command) => {
        embed.setTitle(Commands);
        embed.addField(command.name, command.description);
      });
    return msg.edit(loadembed);
    }
}

module.exports = Help;