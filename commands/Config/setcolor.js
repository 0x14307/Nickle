const Command = require('../../class/Command')
const {
    MessageEmbed
} = require('discord.js')

class SetColor extends Command {

    constructor(client) {
        super(client, {
            name: "setcolor",
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
        let setColorEmbed = new MessageEmbed()
        setColorEmbed.setColor(dbdata.guild.settings.colorEmbed)
        if (!args[0]) {
            setColorEmbed.setTitle(`:x: Error`)
            setColorEmbed.setDescription(`You need to specify a new color for this server. the actual color is \`${dbdata.guild.settings.colorEmbed}\``)
            message.channel.send(setColorEmbed)
            return;
        }

        if (args[0] === dbdata.guild.settings.colorEmbed) {
            setColorEmbed.setTitle(`:x: Error`)
            setColorEmbed.setDescription(`The color is already \`${args[0]}\``)
            message.channel.send(setColorEmbed)
            return;
        }

        setColorEmbed.setTitle(`⌛ Changing color.`)
        setColorEmbed.setDescription(`Please wait while we changing color.`)
        message.channel.send(setColorEmbed).then(async msg => {

            dbdata.guild.settings.colorEmbed = args[0];
            dbdata.guild.markModified("settings");
            dbdata.guild.save();

            setColorEmbed.setTitle(`:white_check_mark: Success`)
            setColorEmbed.setDescription(`The color has been updated to \`${args[0]}\``)
            msg.edit(setColorEmbed)
        })
    }
}
module.exports = SetColor;