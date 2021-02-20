const {
    Client,
    Collection
} = require("discord.js");
const path = require("path")

class Base extends Client {

    constructor(options) {
        super(options);
        this.config = require("../config");
        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.guildsData = require('../db_schema/Guild')
        this.databaseCache = {};
        this.databaseCache.guilds = new Collection();
    }
    loadCommand(Path, Name) {
        try {
            const cmdfn = new(require(`.${Path}${path.sep}${Name}`))(this);
            console.log(`[CMD Handler] : Loading command ${cmdfn.help.name} ✅`);
            cmdfn.conf.location = Path;
            if (cmdfn.init) {
                cmdfn.init(this);
            }
            this.commands.set(cmdfn.help.name, cmdfn);
            cmdfn.help.aliases.forEach((alias) => {
                this.aliases.set(alias, cmdfn.help.name);
            });
            return false;
        } catch (e) {
            return `[CMD Handler] : Unable to load command ${Name} ❌ Error: ${e}`;
        }
    }
    async unloadCommand(Path, Name) {
        let command;
        if (this.commands.has(Name)) {
            command = this.commands.get(Name);
        } else if (this.aliases.has(Name)) {
            command = this.commands.get(this.aliases.get(Name));
        }
        if (!command) {
            return `The command \`${Name}\` doesn't seem to exist, nor is it an alias. Try again!`;
        }
        if (command.shutdown) {
            await command.shutdown(this);
        }
        delete require.cache[require.resolve(`.${Path}${path.sep}${Name}.js`)];
        return false;
    }
    async findOrCreateGuild({
        guildID: guildID
    }, isLean) {
        if (this.databaseCache.guilds.get(guildID)) {
            return isLean ? this.databaseCache.guilds.get(guildID).toJSON() : this.databaseCache.guilds.get(guildID);
        } else {
            let guildData = (isLean ? await this.guildsData.findOne({
                guildID: guildID
            }).populate("members").lean() : await this.guildsData.findOne({
                guildID: guildID
            }).populate("members"));
            if (guildData) {
                if (!isLean) this.databaseCache.guilds.set(guildID, guildData);
                return guildData;
            } else {
                guildData = new this.guildsData({
                    guildID: guildID
                });
                await guildData.save();
                this.databaseCache.guilds.set(guildID, guildData);
                return isLean ? guildData.toJSON() : guildData;
            }
        }
    }
    async resolveUser(search) {
        let user = null;
        if (!search || typeof search !== "string") return;
        if (search.match(/^<@!?(\d+)>$/)) {
            const id = search.match(/^<@!?(\d+)>$/)[1];
            user = this.users.fetch(id).catch(() => {});
            if (user) return user;
        }
        if (search.match(/^!?(\w+)#(\d+)$/)) {
            const username = search.match(/^!?(\w+)#(\d+)$/)[0];
            const discriminator = search.match(/^!?(\w+)#(\d+)$/)[1];
            user = this.users.find((u) => u.username === username && u.discriminator === discriminator);
            if (user) return user;
        }
        user = this.users.cache.find((r) => search === r.username);
        if (user) return user;
        user = await this.users.fetch(search).catch(() => {});
        return user;
    }

    async resolveMember(search, guild) {
        let member = null;
        if (!search || typeof search !== "string") return;
        if (search.match(/^<@!?(\d+)>$/)) {
            const id = search.match(/^<@!?(\d+)>$/)[1];
            member = await guild.members.fetch(id).catch(() => {});
            if (member) return member;
        }
        if (search.match(/^!?(\w+)#(\d+)$/)) {
            guild = await guild.fetch();
            member = guild.members.cache.find((m) => m.user.tag === search);
            if (member) return member;
        }
        member = await guild.members.fetch(search).catch(() => {});
        return member;
    }

    async resolveRole(search, guild) {
        let role = null;
        if (!search || typeof search !== "string") return;
        if (search.match(/^<@&!?(\d+)>$/)) {
            const id = search.match(/^<@&!?(\d+)>$/)[1];
            role = guild.roles.cache.get(id);
            if (role) return role;
        }
        role = guild.roles.cache.find((r) => search === r.name);
        if (role) return role;
        role = guild.roles.cache.get(search);
        return role;
    }

    async resolveChannel(search, guild) {
        let channel = null;
        if (!search || typeof search !== "string") return;
        if (search.match(/^<#!?(\d+)>$/)) {
            const id = search.match(/^<#!?(\d+)>$/)[1];
            channel = guild.channels.cache.get(id);
            if (channel) return channel;
        }
        channel = guild.channels.cache.find((r) => search === r.name);
        if (channel) return channel;
        channel = guild.channels.cache.get(search);
        return channel;
    }
    catchError(error, message) {
        this.users.cache.get(this.config.OWNERS).send(`There was an error with Mercury at ${message.channel} : \`\`\`${error}\`\`\``);
    }
}

module.exports = Base;