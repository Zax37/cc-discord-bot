const Bot = require('./bot');
const Server = require('./server');

let botname = "Claw"

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
  botname = "TestClaw"
}

// Start HTTP server
const server = new Server(process.env.PORT);

// Start Discord Bot
const bot = new Bot(botname);
bot.start(process.env.BOT_TOKEN);
