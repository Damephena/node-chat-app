const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {

	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: '1',
			name: "Ifenna",
			room: 'Node Course'
		}, {
			id: '2',
			name: "Oge",
			room: 'React Course'
		}, {
			id: '3',
			name: "Eleezs",
			room: 'Node Course'
		}]
	});

	it('should add new users', () => {
		var users = new Users();
		var user = {
			id: "123",
			name: 'Ifenna',
			room: 'The office fans'
		};
		var resUser = users.addUser(user.id, user.name, user.room)

		expect(users.users).toEqual([user]);
	});

	it('should remove a user', () => {
		var userId = '1';
		var user = users.removeUser(userId);

		expect(user.id).toBe(userId);
		expect(users.users.length).toBe(2);
	});

	it('should not remove a user', () => {
		var userId = '3234';
		var user = users.removeUser(userId);

		expect(user).toBeFalsy();
		expect(users.users.length).toBe(3);
	});

	it('should find user', () => {
		var userId = '2';
		var user = users.getUser(userId);

		expect(user.id).toBe(userId);
	});

	it('should not find user', () => {
		var userId = '234'
		var user = users.getUser(user);

		expect(user).toBeFalsy();
	});

	it('should return names for node course', () => {
		var userList = users.getUserList('Node Course');

		expect(userList).toEqual(['Ifenna', 'Eleezs']);
	});

	it('should return names for node course', () => {
		var userList = users.getUserList('React Course');

		expect(userList).toEqual(['Oge']);
	});
});