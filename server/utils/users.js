// [{
// 	id: '/#1234235dfgvd',
// 	name: 'Ifenna',
// 	room: 'The Office Fans'
// }]

class Users {
	constructor () {
		this.users = [];
	}
	addUser (id, name, room){
		var user = {id, name, room};
		// var oldUsers = this.users.filter((older) => older.room === user.room);
		// var filteredUsers = oldUsers.map((old) => old.name);

		// if (user.name == filteredUsers) {
		// 	this.users.pop(user);
		// } else {
		// 	this.users.push(user);	
		// }
		this.users.push(user);
		return user;
	}

	removeUser (id) {
		// return user that was removed
		var user = this.getUser(id);

		if (user) {
			this.users = this.users.filter((user) => user.id !== id);
		}

		return user;
	}

	getUser (id) {
		// returns the first on list
		return this.users.filter((user) => user.id === id)[0];
	}

	getUserList (room) {
		var users = this.users.filter((user) => user.room === room);
		var namesArray = users.map((user) => user.name);

		return namesArray;
	}
}

module.exports = {Users};