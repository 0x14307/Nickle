const Command = require('../../class/Command')
const {
    MessageEmbed
} = require('discord.js')

class SetPrefix extends Command {

    constructor(client) {
        super(client, {
            name: "setprefix",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [],
            memberPermissions: ["ADMINISTRATOR"],
            botPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            ownerOnly: false,
            nsfw: false,
            cooldown: -1,
            description: "Set the bot prefix."
        });
    }
    async execute(message, args, dbdata) {
        let setprefixEmbed = new MessageEmbed()
        setprefixEmbed.setColor(dbdata.guild.settings.colorEmbed)
        if (!args[0]) {
            setprefixEmbed.setTitle(`:x: Error`)
            setprefixEmbed.setDescription(`You need to specify a new prefix for this server. the actual prefix is \`${dbdata.guild.settings.prefix}\``)
            message.channel.send(setprefixEmbed)
            return;
        }

        if (args[0].length > 5) {
            setprefixEmbed.setTitle(`:x: Error`)
            setprefixEmbed.setDescription(`Maximum prefix length is 5 characters.`)
            message.channel.send(setprefixEmbed)
            return;
        }

        if (args[0] === dbdata.guild.settings.prefix) {
            setprefixEmbed.setTitle(`:x: Error`)
            setprefixEmbed.setDescription(`The prefix is already \`${args[0]}\``)
            message.channel.send(setprefixEmbed)
            return;
        }

        setprefixEmbed.setTitle(`⌛ Changing prefix.`)
        setprefixEmbed.setDescription(`Please wait while we changing prefix.`)
        message.channel.send(setprefixEmbed).then(async msg => {

            dbdata.guild.settings.prefix = args[0];
            dbdata.guild.markModified("settings");
            dbdata.guild.save();

            setprefixEmbed.setTitle(`:white_check_mark: Success`)
            setprefixEmbed.setDescription(`The prefix has been updated to \`${args[0]}\``)
            msg.edit(setprefixEmbed)
        })
    }
}
module.exports = SetPrefix;