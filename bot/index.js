const Discord = require('discord.js');
const CommandGroup = require('./commandgroup');

const commands = require('./commands');
const db = require('../dbproxy');

class Bot {
  constructor(name) {
    // Initialize Discord Bot
    const bot = this.bot = new Discord.Client();
    
    // List available commands and their aliases
    const commandGroup = new CommandGroup();
    commandGroup.add(new commands.SlapCommand(bot), ["slap"]);
    commandGroup.add(new commands.ImageCommand("https://cdn.discordapp.com/emojis/464175681304133639.gif?v=1"), ["lol"]);

    bot.on('ready', function (evt) {
      bot.user.setActivity('for commands', { type: 'LISTENING' });
      bot.user.setUsername(name);
      console.log('Connected as ' + name);
    });

    bot.on('message', message => {
      let command, args;
      let shouldBotProcess = false;
      const firstChar = message.content.substring(0, 1);
      const options = { };

      if (message.isMentioned(bot.user) && message.content.startsWith(`<@${bot.user.id}> `)) {
        args = message.content.substring(22).split(' ');
        shouldBotProcess = true;
      } else if (firstChar == '/' || firstChar == '!') {
        args = message.content.substring(1).split(' ');
        shouldBotProcess = true;
      } else if (message.channel.type === "dm" && message.author !== bot.user) {
        args = message.content.split(' ');
        shouldBotProcess = true;
      }

      if (shouldBotProcess) {
        command = args[0];
        args = args.splice(1);

        const found = commandGroup.parse(command);

        if (found) {
          found.command.execute(message, options);
        } else {
          commands.StandardErrorResponse(message);
        }
      }



      if (false) {
        switch (cmd) {
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
                  .push({ id, text })
                  .write()
              } else {
                message.react('❓');
              }
            } else {
              var id = args[0];
              let text = db.get('quotes')
                .filter({ id })
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
        }
      }
    });
  }

  start(token) {
    this.bot.login(token);
  }
}

module.exports = Bot;
