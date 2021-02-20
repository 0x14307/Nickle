const Discord = require("discord.js");
const Command = require('../../class/Command')

class Eval extends Command {

    constructor(client) {
        super(client, {
            name: "eval",
            dirname: __dirname,
            enabled: true,
            guildOnly: false,
            aliases: [],
            memberPermissions: [],
            botPermissions: ['EMBED_LINKS', 'SEND_MESSAGES'],
            ownerOnly: true,
            nsfw: false,
            cooldown: -1,
            description: "Evaluate JS Code"
        });
    }
    async execute(message, args, dbdata) {
        const content = message.content
            .split(" ")
            .slice(1)
            .join(" ");

        if (!content) return message.channel.send(`Please provide some code to run.`)
        const result = new Promise(resolve => resolve(eval(content)));

        let output;

        function SendEmbed(output) {
            const embede = new Discord.MessageEmbed()
                .setTitle('Evaluation')
                .addField("Input:", `\`\`\`js\n${content}\`\`\``)
                .addField("Output:", `\`\`\`js\n${output}\`\`\``)
                .setColor(dbdata.guild.settings.colorEmbed)
                .setFooter(`${message.author.tag}`, message.author.displayAvatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            if (
                output.length > 1024 &&
                output.length < 80000
            ) {
                require("hastebin-gen")(output, {
                    extension: "js"
                }).then(haste =>
                    message.channel.send("Result was too big: " + haste)
                );
            } else if (output.length > 80000) {
                message.channel.send(
                    "I was going to send this in a hastebin, but the result is over 80,000 characters!"
                );
            } else {
                message.channel.send(embede);
            }
        }

        return result
            .then(output => {
                if (typeof output !== "string") {
                    output = require("util").inspect(output, {
                        depth: 0
                    });
                }
                if (output.includes(this.client.token)) {
                    output = output.replace(this.client.token, "T0K3N");
                }
                SendEmbed(output)
            })
            .catch(err => {
                output = err.toString();
                if (output.includes(this.client.token)) {
                    output = err.replace(this.client.token, "T0K3N");
                }
                SendEmbed(output)
            })
    }
}
module.exports = Eval;