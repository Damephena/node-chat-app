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
// To communicate between server and client 
var io = socketIO(server);

// Heroku ready 
const port = process.env.PORT || 3000;

// Express static middleware configuration
app.use(express.static(publicPath));

// register an event listener. io.on('connection' (socket) => ) listens for new individual connections
io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

server.listen(port, () => {
	console.log(`***Started up at ${port}`);
});