const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users.js');
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

// A way to run {Users} that was imported methods 
var users = new Users();

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
	//socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

	// broadcast.emit() prevent message sharer from recieving the sent message.
	//socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback("Name and room are required.");
		}

		// to join a room/add user to room
		socket.join(params.room);
		
		// Removes users from any previous room before joining new room
		users.removeUser(socket.id);
		
		// To add joined members to Contact Panel
		users.addUser(socket.id, params.name, params.room);
		
		// To inform everyone in room on new members joined
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));		
		
		// greeting individual user
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

		callback(); 
	});

	// custom event listener
	socket.on('createMessage', (message, callback) => {
		var user = users.getUser(socket.id);

		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}

		callback();
	});

	socket.on('createLocationMessage', (coords) => {
		var user = users.getUser(socket.id);

		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage( user.name, coords.latitude, coords.longitude))
		}
	});

	socket.on('disconnect', () => {
		// When user disconnects
		var user = users.removeUser(socket.id);

		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
		}
	});
});

server.listen(port, () => {
	console.log(`***Started up at ${port}`);
});