var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		var message = generateMessage('ifenna@trial.com', 'Doing a test case for generation');
		
		expect(message.from).toBe('ifenna@trial.com');
		expect(message.text).toBe('Doing a test case for generation');
		expect(typeof message.createdAt).toBe('number');
	
	});
});