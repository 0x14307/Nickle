const {
    MessageEmbed
} = require('discord.js')
const Command = require('../../class/Command')
const puppeteer = require('puppeteer');

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
    async execute(message, args, dbdata) {
        let priceEmbed = new MessageEmbed()
        const PriceValudeEmbed = new MessageEmbed()
        PriceValudeEmbed.setColor(dbdata.guild.settings.colorEmbed)
        priceEmbed.setColor(dbdata.guild.settings.colorEmbed)
        if (!args[0]) {
            priceEmbed.setTitle(`:x: Error`)
            priceEmbed.setDescription(`Please provide a stock to fetch.`)
            return message.channel.send(priceEmbed)
        }
        priceEmbed.setTitle(`⌛ Loading please wait...`)
        priceEmbed.setDescription(`This can take a while.`)
        message.channel.send(priceEmbed).then(async msg => {
                const url = ('https://money.cnn.com/quote/quote.html?symb=GME');
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(url);
                // Currently WIP (Needs filtering as well as making sure stuff shows up)
              
                const TickerName = await page.evaluate(
                  () => [...document.querySelectorAll("h1.wsod_fLeft")].map(partner => partner.innerText) 
                );
                const TickerChange = await page.evaluate(
                  () => [...document.querySelectorAll("td.wsod_change span.posdata")].map(partner => partner.innerText) //Gets price change.
                );
                const Name = TickerName;
                const Price = TickerChange.join(' ');
                console.log(TickerName);
                console.log(TickerChange); 
                browser.close();
                PriceValudeEmbed.setTitle(Name)
                PriceValudeEmbed.addField({
                    name: 'Change:',
                    value: Price,
                }, );


                return msg.edit(PriceValudeEmbed);
                }
            
        )
    }
}

module.exports = Price;