if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

var Discord = require('discord.io');
var logger = require('winston');
logger.level = 'debug';
const { Client } = require('pg')
const client = new Client({
	connectionString: process.env.DATABASE_URL
});

// Initialize postgres database connection and tables
client.connect()

const quotes = {};
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
var bot = new Discord.Client({
   token: process.env.BOT_TOKEN,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
	bot.setPresence({ game: { name: 'Claw', type: 0 } });
});
bot.on('message', function (user, userID, channelID, message, evt) {
    if (message.substring(0, 1) == '/') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'quote':
				if (args[0] == 'add') {
					var id = args[1];
					args = args.splice(2);
					quotes[id] = args.join(" ");
					client.query('INSERT INTO QUOTES VALUES($1::text, $2::text);', [id, quotes[id]])
						.catch(e => {
							bot.sendMessage({
								to: channelID,
								message: "Sorry, I've had some problem inserting this quote :("
							});
							console.error(e.stack);
						});
				} else {
					var id = args[0];
					args = args.splice(1);
					bot.sendMessage({
						to: channelID,
						message: "```\n" + quotes[id] + "\n```"
					});
				}
            case 'slap':
				if (args[0] && args[0].substring(0, 2) == '<@') {
					var random = Math.random() >= 0.5;
					bot.sendMessage({
						to: channelID,
						message: args[0] + ' <:artur:366979293466722305> CHEW ON ' + (random ? 'THIS!' : 'THAT!') 
					});
				}
            break;
         }
     }
});