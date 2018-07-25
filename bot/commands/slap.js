let tntEmojiId = '366979293466722305';

class SlapCommand {
  constructor(bot) {
    this.bot = bot;
  }

  execute(message) {
    const tntEmoji = this.bot.emojis.find('id', tntEmojiId);

    var random = Math.random() >= 0.5;
    message.mentions.users.forEach(user => {
      user.send(tntEmoji + ' CHEW ON ' + (random ? 'THIS!' : 'THAT!'));
    });

    message.react(tntEmoji);
  }
}

module.exports = SlapCommand;
