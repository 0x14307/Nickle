const { Client, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const querystring = require('querystring');
const { resourceLimits } = require('worker_threads');
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);

console.log("Starting up!");

const client = new Client();
const prefix = '!';

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		message.channel.send(file);
	} else if (command === 'fetch') {
		if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}

		const query = querystring.stringify({ term: args.join(' ') });

    const { list } = await fetch(`https://api.polygon.io/v1/meta/symbols/${query}/company?&apiKey=alae9s3cJueg35o9fCBRY2Ap7qzzDCV3`).then(response => response.json());
    const [answer] = list;
    const embed = new MessageEmbed()
      .setColor('#EFFF00')
      .setURL(list.url)
      .addFields(
        { name: 'Ticker', value: trim(answer.symbol, 1024) },
        { name: 'Similar', value: trim(answer.similar, 1024) },
      );
		message.channel.send(embed);
	}
});

client.login('ODEyMTIxODg1OTI3OTMxOTI1.YC8Jcg.RyBYjD5BqWUnGdRshOKokIV2lxw');