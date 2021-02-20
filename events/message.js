const {
    Collection,
    MessageEmbed
} = require("discord.js")
const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cmdCooldown = new Collection();
const Event = require('../class/Event')

module.exports = class Message extends Event {
    constructor(...args) {
        super(...args, {
            name: "Message"
        })
    }
    async execute(message) {
        if (message.author.bot) return;

        const dbdata  = {}

        const guild = await this.client.findOrCreateGuild({
            guildID: message.guild.id
        });
        message.guild.dbdata = dbdata.guild = guild;

        let messageEventEmbed = new MessageEmbed()
        messageEventEmbed.setColor(dbdata.guild.settings.colorEmbed)

        const theprefix = dbdata.guild.settings.prefix || this.client.config.PREFIX

        this.client.prefix = theprefix;
        const prefixRegex = new RegExp(
            `^(<@!?${this.client.user.id}>|${escapeRegex(theprefix)})\\s*`
        );
        if (!prefixRegex.test(message.content)) return;

        if (message.content.match(new RegExp(`^<@!?${this.client.user.id}>( |)$`))) {
            messageEventEmbed.setTitle(`The prefix is set to: \`${theprefix}\``)
            message.channel.send(messageEventEmbed);
            return;
        }

        const [, matchedPrefix] = message.content.match(prefixRegex);

        const args = message.content
            .slice(matchedPrefix.length)
            .trim()
            .split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command =
            this.client.commands.get(commandName) ||
            this.client.commands.find(
                cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName)
            );

        if (!command) return;

        if (!command.conf.enabled) return message.channel.send(`\`${command.help.name}\` has been temporarily disabled by the owner of the bot.`).then(m => m.delete({
            timeout: 10000
        }))
        if (command.conf.ownerOnly) {
            if (!this.client.config.OWNERS.includes(message.author.id)) return message.channel.send('That command is owner only.').then(m => m.delete({
                timeout: 10000
            }))
        }
        if (command.conf.guildOnly && !message.guild) return message.channel.send(`\`${command.help.name}\` is only usable in guild.`).then(m => m.delete({
            timeout: 10000
        }))

        let neededPermissions = [];
        if (command.conf.botPermissions) {
            command.conf.botPermissions.forEach((perm) => {
                if (!message.guild.me.hasPermission(perm)) {
                    neededPermissions.push(perm);
                }
            })
        }
        if (neededPermissions.length > 0) {
            messageEventEmbed.setTitle(`:x: I need permission \`${neededPermissions}\` , please contact an administrator.`)
            message.channel.send(messageEventEmbed).then(m => m.delete({
                timeout: 10000
            }))
            return;
        }
        if (command.conf.memberPermissions) {
            command.conf.memberPermissions.forEach((perm) => {
                if (!message.guild.member(message.author).hasPermission(perm)) {
                    neededPermissions.push(perm);
                }
            })
        }
        if (neededPermissions.length > 0) {
            messageEventEmbed.setTitle(`:x: \`${message.author.tag}\`, You need permission \`${neededPermissions}\` for that command.`)
            message.channel.send(messageEventEmbed).then(m => m.delete({
                timeout: 10000
            }))
            return;
        }
        if (command.conf.nsfw) {
            if (!message.channel.nsfw) {
                messageEventEmbed.setTitle(':x: Please an NSFW Channel is required for that type of command.')
                message.channel.send(messageEventEmbed).then(m => m.delete({
                    timeout: 10000
                }))
                return;
            }
        }

        let uCooldown = cmdCooldown[message.author.id];
        if (!uCooldown) {
            cmdCooldown[message.author.id] = {};
            uCooldown = cmdCooldown[message.author.id];
        }
        const time = uCooldown[command.help.name] || 0;
        if (time && (time > Date.now())) {
            return message.reply(`:x: Please wait ${Math.ceil((time-Date.now())/1000)} second(s) before reusing the \`${command.help.name}\` command.`);
        }
        cmdCooldown[message.author.id][command.help.name] = Date.now() + command.conf.cooldown;

        try {
            command.execute(message, args, dbdata);
        } catch (error) {
            console.log(error);
        }
    }
}