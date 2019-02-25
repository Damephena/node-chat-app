const {generateMessage} = require('./utils/message.js');
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
	// emit() creates an event rather than listening for one.
	// It does not require a callback function, but instead an optional data to be sent.
	//socket.emit() emits to single connections

	// greeting individual user
	socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));


	// custom event listener
	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
		// io.emit() emits to multiple connections

		io.emit('newMessage', generateMessage(message.from, message.text));

		// broadcast.emit() prevent message sharer from recieving the sent message.
		// socket.broadcast.emit('newMessage', {
		// 	from: message.from,
		// 	text: message.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

server.listen(port, () => {
	console.log(`***Started up at ${port}`);
});