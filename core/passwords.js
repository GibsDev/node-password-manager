const database = require('./database.js');
const cryptography = require('./cryptography.js');
const users = require('./users.js');
const { data } = require('jquery');

const passwords_db = 'passwords'; // Directory node

class Password {
	constructor(name, user, pass, info, pinfo, iv) {
		this.name = name;
		this.username = user;
		this.password = pass;
		this.info = info;
		this.pinfo = pinfo;
		if (iv != undefined) {
			this.iv = iv;
		}
	}

	isEncrypted() {
		return this.iv != undefined;
	}

	encrypt(key) {
		if (!this.isEncrypted()) {
			const e_username = cryptography.encrypt(this.username, key);
			this.iv = e_username.iv;
			this.username = e_username.ciphertext;
			this.password = cryptography.encrypt(this.password, key, this.iv).ciphertext;
			this.pinfo = cryptography.encrypt(this.pinfo, key, this.iv).ciphertext;
		}
	}

	decrypt(key) {
		if (this.isEncrypted()) {
			this.username = cryptography.decrypt(this.username, key, this.iv);
			this.password = cryptography.decrypt(this.password, key, this.iv);
			this.pinfo = cryptography.decrypt(this.pinfo, key, this.iv);
			delete this.iv;
		}
	}
}

const passwords = {};

/**
 * Stores a password for the given (server) username
 * @param {string} username server username
 * @param {string} name password name
 * @param {string} user password username
 * @param {string} pass password password
 * @param {string} info password info
 * @param {string} pinfo password private info
 * @param {string} key encryption key
 * @returns {Promise<void>} when the password is stored
 */
passwords.put = (username, name, user, pass, info, pinfo, key) => {
	console.log(`KEY!!! '${key}'.length = ${key.length}`);
	const password = new Password(name, user, pass, info, pinfo);
	password.encrypt(key);
	return database.put(passwords_db + '/' + username, password.name, password);
};

/**
 * Reterives a password
 * @param {string} username server username
 * @param {string} passwordname password name
 * @param {string} key decryption key
 * @returns {Promise} that resolves to the decrypted password
 */
passwords.get = (username, passwordname, key) => {
	console.log(`Getting password '${passwordname}' for '${username}' with '${key}'`);
	return new Promise((resolve, reject) => {
		database.get(passwords_db + '/' + username, passwordname).then(p => {
			const password = new Password(p.name, p.username, p.password, p.info, p.pinfo, p.iv);
			if (key) {
				try {
					password.decrypt(key);
				} catch (e) {
					console.log('Could not decrypt key');
					reject(e);
				}
			}
			resolve(password);
		}).catch(err => reject(err));
	});
};

/**
 * Gets all the names (ids) of the passwords for a given user
 * @param {string} username server user
 * @returns {Promise} that resolves to an array of password names
 */
passwords.getNames = (username) => {
	return new Promise((resolve, reject) => {
		database.getNode(passwords_db + '/' + username).then(passwords => {
			resolve(Object.keys(passwords));
		}).catch(err => reject(err));
	});
};

/**
 * Deletes a given password from the database
 * @param {string} user the user who is making the delete request
 * @param {string} passwordname the name of the password to be deleted
 * @returns {Promise} thet resolves if the password was deleted
 */
passwords.delete = (user, passwordname) => {
	return new Promise((resolve, reject) => {
		database.delete(passwords_db + '/' + user, passwordname)
			.then(resolve)
			.catch(err => reject(err));
	});
};

module.exports = passwords;
