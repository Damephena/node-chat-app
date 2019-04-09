// initiating a request from the client to the server to open up a websocket and keeps it open.
var socket = io();

//for auto-scrolling
function scrollToBottom () {
	//Selectors
	var messages = jQuery('#messages');
	var newMessage = messages.children('li:last-child')
	// Height
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight(); //innerHeight addes CSS padding or whatever
	var lastMessageHeight = newMessage.prev().innerHeight(); //taking account of last message BEFORE the new last message.

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
		// set scrollTop value to scrollHeight to Automate scrolling
		messages.scrollTop(scrollHeight);
	}
}

//built-in event
socket.on('connect', () => {
	var params = jQuery.deparam(window.location.search);

	socket.emit('join', params, (err) => {
		if (err) {
			alert(err);
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
});

socket.on('disconnect', () => {
	console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
	var ol = jQuery('<ol></ol>');

	users.forEach((user) => {
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery('#users').html(ol);
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
	scrollToBottom();
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