const http = require('http');
const Discord = require('discord.js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const fs = require('fs');

let botname = "Claw"

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
	botname = "TestClaw"
}

const port = process.env.PORT;

// Open json database
const adapter = new FileSync('db.json');
const db = low(adapter);

// Set some defaults (required if JSON file is empty)
db.defaults({ quotes: [] })
  .write()

// Start minimal UI endpoint
http.createServer(function (req, res) {
	if (req.url === '/') {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(JSON.stringify(db.get('quotes').value()), null, 4);
		res.end();
	} else {
		res.writeHead(404);
		res.end();
	}
}).listen(port);

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', function (evt) {
	bot.user.setActivity('for commands', { type: 'LISTENING' });
	bot.user.setUsername(botname);
	console.log('Connected as '+botname);
});

bot.on('message', message => {
    if (message.content.substring(0, 1) == '/') {
        var args = message.content.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
			case 'download':
				if (args[0] == '<:CrazyHook:403620438862856192>' || args[0] == 'ch' || args[0] == 'CH'
					|| args[0] == 'crazyhook' || args[0] == 'CrazyHook') {
					message.channel.send("http://uploadfile.pl/pokaz/1448369---n92j.html");
				} else if (args[0] == '<:extralife:464171299271344150>' || args[0] == '<:ThanksForNotAbortingMe:403619789559431168>'
					|| args[0] == 'claw' || args[0] == 'cc') {
					message.channel.send("http://kapitanpazur.piasta.pl/dl/claw_rip.zip");
				} else if (args[0] == '<:wapmap:464169953336098817>' || args[0] == 'wapmap' || args[0] == 'wm') {
					message.channel.send("http://kapitanpazur.piasta.pl/dl/wapmap.zip");
				}
			break;
			case 'play':
				if (args[0] == 'hax') {
					message.channel.send("Sorry, haxball is not nice to bots :( You'll have to create room yourself: https://haxball.com/play");
				}
			break;
            case 'quote':
				if (args[0] == 'add') {
					const id = args[1];
					if (message.mentions.users.size === 0) {
						let text = args.splice(2).join(" ");
						db.get('quotes')
							.push({id, text})
							.write()
					} else {
						message.react('❓');
					}
				} else {
					var id = args[0];
					let text = db.get('quotes')
						.filter({id})
						.map('text')
						.value()[0];
					if (text) {
						message.channel.send({
							embed: {
								color: 3447003,
								author: {
								  name: bot.user.username,
								  icon_url: bot.user.avatarURL
								},
								description: text,
								timestamp: new Date()
							}
						});
					} else {
						message.react('❓');
					}
				}
			break;
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