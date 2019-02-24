// initiating a request from the client to the server to open up a websocket and keeps it open.
var socket = io();

//built-in event
socket.on('connect', () => {
	console.log('connected to server');
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

//custom event listener
socket.on('newMessage', (message) => {
	console.log('New Message', message);
});