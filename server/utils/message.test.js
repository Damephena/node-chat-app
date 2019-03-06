var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
 	it('should generate correct message object', () => {
 		var message = generateMessage('ifenna@trial.com', 'Doing a test case for generation');
		
 		expect(message.from).toBe('ifenna@trial.com');
 		expect(message.text).toBe('Doing a test case for generation');
 		expect(typeof message.createdAt).toBe('number');
	
 	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location object', () => {
		var location = generateLocationMessage('Ifenna', 123, 234435);

		expect(location.from).toBe('Ifenna');
		expect(location.url).toBe('https://www.google.com/maps?q=123,234435');
		expect(typeof location.createdAt).toBe('number')
	});
});