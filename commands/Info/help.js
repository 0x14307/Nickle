const {
    MessageEmbed
} = require('discord.js')
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
    async execute(message, args, dbdata) {
        if (!args[0]) {
            let catgeory = new MessageEmbed()
                .setTitle("Help")
                .setDescription("List of all Catgeory")
                .setColor(`${dbdata.guild.settings.colorEmbed}`);
            catgeory.addFields({
                name: `**>Info**`,
                value: `\`${dbdata.guild.settings.prefix}help info\``,
                inline: false
            }, {
                name: `**>Stocks**`,
                value: `\`${dbdata.guild.settings.prefix}help stocks\``,
                inline: false
            }, {
                name: `**>Config**`,
                value: `\`${dbdata.guild.settings.prefix}help config\``,
                inline: false
            })
            catgeory.setFooter(`${message.author.tag}`, message.author.displayAvatarURL({
                dynamic: true
            }))
            catgeory.setTimestamp();
            return message.channel.send(catgeory)

        }
        let cmdHelp = new MessageEmbed()
        cmdHelp.setColor(dbdata.guild.settings.colorEmbed);
        switch (args[0].toLowerCase()) {
            case 'stocks':
                cmdHelp.setTitle("Help")
                cmdHelp.setDescription("List of Stocks Commands.")
                this.client.commands.filter(c => c.help.category === "Stocks" && c.conf.enabled).forEach((cmd) => {
                    cmdHelp.addField(
                        `**${dbdata.guild.settings.prefix}${cmd.help.name}**`,
                        `${cmd.help.description}`,
                        false
                    );

                });
                cmdHelp.setTimestamp();
                return message.channel.send(cmdHelp)
                break;
            case 'config':
                cmdHelp.setTitle("Help")
                cmdHelp.setDescription("List of Config Commands.")
                this.client.commands.filter(c => c.help.category === "Config" && c.conf.enabled).forEach((cmd) => {
                    cmdHelp.addField(
                        `**${dbdata.guild.settings.prefix}${cmd.help.name}**`,
                        `${cmd.help.description}`,
                        false
                    );

                });
                cmdHelp.setTimestamp();
                return message.channel.send(cmdHelp)
                break;
            case 'info':
                cmdHelp.setTitle("Help")
                cmdHelp.setDescription("List of Information Commands.")
                this.client.commands.filter(c => c.help.category === "Info" && c.conf.enabled).forEach((cmd) => {
                    cmdHelp.addField(
                        `**${dbdata.guild.settings.prefix}${cmd.help.name}**`,
                        `${cmd.help.description}`,
                        false
                    );

                });
                cmdHelp.setTimestamp();
                return message.channel.send(cmdHelp)
                break;
        }
    }
}

module.exports = Help;