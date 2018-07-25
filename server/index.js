const http = require('http');

const db = require('../dbproxy');

const endpointsHandler = function (req, res) {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
		<html>
			<head>
				<title>Claw.io</title>
				<link rel="shortcut icon" href="https://cdn.discordapp.com/emojis/464171299271344150.png?v=1">
			</head>
			<body>
			</body>
		</html>
		`)
    //res.write(JSON.stringify(db.get('quotes').value()), null, 4);
    res.end();
  } else {
    res.writeHead(404);
    res.end();
  }
}

class Server {
  constructor(port) {
    http.createServer(endpointsHandler).listen(port);
  }
};

module.exports = Server;