// for specifying relative/absoulte path using Node.js built-in module
const path = require('path');
// In order to use Socket.io, we need to configure http ourselves.
const http = require('http');

// Express route handlers
const express = require('express');
const bodyParser = require('body-parser');

const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

var app = express();

// Create a server ourselves(although already used behind the scene for Express).
var server = http.createServer(app);

// Heroku ready 
const port = process.env.PORT || 3000;

// Express static middleware configuration
app.use(express.static(publicPath));

server.listen(port, () => {
	console.log(`***Started up at ${port}`);
});