const expect = require('expect');

const {isRealString} = require('./validation.js');

describe('isRealString', () => {
	it('should reject non-string values', () => {
		var params = {name: 'Ifehna', room: 1123452}
		var res = isRealString(params);

		expect(res).toBe(false);
	});

	it('should reject string with only spaces', () => {
		var res = isRealString('     ');
		expect(res).toBe(false);
	});

	it('should allow string with non-space characters', () => {
		var res = isRealString('   dfkmndsofjoesad   ');
		expect(res).toBe(true);
	});
})