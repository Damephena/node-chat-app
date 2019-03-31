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
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	// to render a new message without a template like Mustache
	// var li = jQuery('<li></li>'); // create a tag
	// li.text(`${message.from} ${formattedTime}: ${message.text}`);

	// jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	})
	jQuery('#messages').append(html);
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