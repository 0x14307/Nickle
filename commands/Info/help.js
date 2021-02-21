const { MessageEmbed } = require('discord.js')
const Command = require('../../class/Command')

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
        const HelpEmbed = new MessageEmbed()
        this.client.commands.forEach((command) => {
        HelpEmbed.setTitle('Commands');
        HelpEmbed.addField(command.name, command.description);
        message.send.HelpEmbed();
      }); 
    }
  }

module.exports = Help;
