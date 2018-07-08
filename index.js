if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const Discord = require('discord.js');
const logger = require('winston');
logger.level = 'debug';

const quotes = {};

const { Client } = require('pg')
const client = new Client({
	connectionString: process.env.DATABASE_URL
});

// Initialize postgres database connection and tables
client.connect()


client.query('CREATE TABLE IF NOT EXISTS QUOTES (id varchar(20) PRIMARY KEY, text text);')
	.then(_ => 
		client.query('SELECT * FROM QUOTES;')
		.then(res => res.rows.forEach(
			(el) => {
				quotes[el.id] = el.text;
			}
		)).catch(e => console.error(e.stack))
	).catch(e => console.error(e.stack));

/*client.query('SELECT $1::text as message', ['Hello world!'], (err,res) => {
	console.log(res.rows[0].message) // Hello world!
	client.end()
});*/

const express = require('express');
const app = express();

app.set('json spaces', 4);
app.get('/', (req, res) => res.json({quotes}));
app.listen(process.env.PORT || 5000, () => console.log('Listening on port '+(process.env.PORT || 5000)));

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
	bot.user.setActivity('for commands', { type: 'LISTENING' });
	bot.user.setUsername('Claw')
});

bot.on('message', message => {
    if (message.content.substring(0, 1) == '/') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'quote':
				if (args[0] == 'add') {
					var id = args[1];
					quotes[id] = args.join(" ");
					client.query('INSERT INTO QUOTES VALUES($1::text, $2::text);', [id, quotes[id]])
						.catch(e => {
							message.channel.send("Sorry, I've had some problem inserting this quote :(");
							console.error(e.stack);
						});
				} else {
					var id = args[0];
					message.channel.send("```\n" + quotes[id] + "\n```");
				}
            case 'slap':
				var random = Math.random() >= 0.5;
				message.mentions.users.forEach(user => {
					user.send('<:artur:366979293466722305> CHEW ON ' + (random ? 'THIS!' : 'THAT!'));
				});
				message.react(message.guild.emojis.get('366979293466722305'));
            break;
         }
     }
});

bot.login(process.env.BOT_TOKEN);