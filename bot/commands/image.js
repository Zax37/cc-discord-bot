const GenericCommand = require('./generic');

class ImageCommand extends GenericCommand {
  constructor(url) {
    super();
    this.url = url;
  }

  execute(message) {
    message.channel.send({
      embed: {
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL
        },
        image: {
          url: this.url
        }
      }
    });
    
    if (message.channel.type !== 'dm') {
      message.delete();
    }
  }
}

module.exports = ImageCommand;
