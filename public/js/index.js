// initiating a request from the client to the server to open up a websocket and keeps it open.
var socket = io();

//built-in event
socket.on('connect', () => {
	console.log('connected to server');
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

//custom event listener for New messages
socket.on('newMessage', (message) => {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	// to render a new message
	var li = jQuery('<li></li>'); // create a tag
	li.text(`${message.from} ${formattedTime}: ${message.text}`);

	jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');

	li.text(`${message.from} ${formattedTime}: `);
	a.attr('href', message.url);
	li.append(a);
	jQuery('#messages').append(li);
})

// to create acknowledgement, we use callbacks

jQuery('#message-form').on('submit', (e) => {
	e.preventDefault(); //to override the 'refresh page' process

	var messageTextbox = jQuery('[name=message]');

	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message]').val()
	}, () => {
		messageTextbox.val(''); // to clear input box after message is sent
	});
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
	if (!navigator.geolocation){
		return alert('Geolocation not supported by your browser.');
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...');

	navigator.geolocation.getCurrentPosition((position) => {
		locationButton.removeAttr('disabled').text('Send location'); 
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, () => {
		locationButton.removeAttr('disabled').text('Send location'); 
		alert('Unable to fetch location');
	});
});