const cryptography = require('./cryptography.js');
const database = require('./database.js');

const users_db = 'users'; // End node

class User {
	constructor(username, password) {
		this.username = username;
		this.password = cryptography.hash(password);
	}
}

// For module.exports
const users = {};

/**
 * Create a user and insert them into the database.
 * This will overwrite a user with the same username.
 * Overwriting user is essentially the same thing as changing the password.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<void>} when the user has been inserted
 */
users.create = (username, password) => {
	const user = new User(username, password);
	const dbobj = {
		password: user.password.hash,
		salt: user.password.salt
	};
	return database.put(users_db, username, dbobj);
};

/**
 * Verify the users credentials are correct
 * @param {string} username
 * @param {string} password
 * @returns {Promise<void>} resolves if the users credentials are valid
 */
users.verify = (username, password) => {
	return new Promise((resolve, reject) => {
		database.get(users_db, username).then(dbobj => {
			const hashObj = cryptography.hash(password, dbobj.salt);
			if (dbobj.password == hashObj.hash) resolve();
			reject(new Error('Password hash did not match'));
		}).catch(err => {
			reject(new Error(`User '${username}' does not exist`));
		});
	});
};

/**
 * Check if the user has two factor authentication email set
 * @param {string} username
 * @returns {Promise<boolean>} if the user has 2fa email
 */
users.hasTwoFactorEnabled = async (username) => {
	return Boolean(await users.getTwoFactorEmail(username));
};

/**
 * Get the users two factor authentication email address
 * @param {string} username
 * @returns {Promise<string|undefined>} the users two factor authentication email or undefined
 */
users.getTwoFactorEmail = (username) => {
	return new Promise((resolve, reject) => {
		database.get(users_db, username).then(dbobj => {
			return resolve(dbobj.two_factor_email);
		}).catch(err => {
			reject(new Error(`User '${username}' does not exist`));
		});
	});
};

module.exports = users;
