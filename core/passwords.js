const database = require('./database.js');
const cryptography = require('./cryptography.js');
const log = require('loglevel');
const crypto = require('crypto');
require('./array-utils.js');
require('./string-utils.js');

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
	log.debug(`Inserting password '${name}' for '${username}'`);
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
	log.debug(`Getting password '${passwordname}' for '${username}'`);
	return new Promise((resolve, reject) => {
		database.get(passwords_db + '/' + username, passwordname).then(p => {
			const password = new Password(p.name, p.username, p.password, p.info, p.pinfo, p.iv);
			if (key) {
				try {
					password.decrypt(key);
				} catch (e) {
					log.debug('Could not decrypt password with given key');
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

passwords.utils = {};

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = LOWERCASE.toUpperCase();
const NUMBERS = '0123456789';
// In ASCII order (no space)
const SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
// (no space)
const ALL_CHARACTERS = LOWERCASE + UPPERCASE + NUMBERS + SYMBOLS;
// Characters that could potentially mess up poorly written software
const AMBIGUOUS_CHARACTERS = '{}[]()/\\\'"`~,;:.<>';

/**
 * Helper function for passwords.utils.generateWithOptions. Ensures the password complies with the given requirement.
 * @param {string} password the base password to modify
 * @param {Array<Number>} indexes a shuffled queue of remaining modifiable character indexes in the password
 * @param {string} pool the password specific pool of characters
 * @param {string} categoryPool the pool of all characters in this category
 * @param {string} optionName the name of the option for the error message eg forceSymbol for options.forceSymbol
 * @param {string} optionType the type of the forced character for the error message
 */
function forceOption(password, indexes, pool, categoryPool, optionName, optionType) {
	// Get the symbols from the pool
	const forcePool = pool.intersect(categoryPool);
	// Make sure that we have the characters needed for this rule
	if (forcePool.length == 0) {
		throw new Error(`options.${optionName} is true, but there are no ${optionType} characters in the pool`);
	}
	// Get the next random modifiable index
	const forceIndex = indexes.pop();
	// Check if we have run out of indexes to modify
	if (forceIndex === undefined) {
		throw new Error('password is too short to meet specified requirements');
	}
	// Make sure we dont call crypto.randomInt(0);
	const poolIndex = (forcePool.length > 1) ? crypto.randomInt(forcePool.length - 1) : 0;
	// Replace the character at the index from the pool
	return password.replaceAt(forceIndex, forcePool[poolIndex]);
}

/**
 * Generates a password with the given contraints
 * @param {Object} options boolean options for password generation
 * @param {Number} options.length amount of characters
 * @param {boolean} options.lowercase include lowercase
 * @param {boolean} options.uppercase include uppercase
 * @param {boolean} options.numbers include numbers
 * @param {boolean} options.symbols include special character
 * @param {boolean} options.space include the space character
 * @param {boolean} options.ambiguous include the ambiguous characters
 * @param {boolean} options.forceSymbol force at least one special character
 * @param {boolean} options.forceNumber force at least one number
 * @param {boolean} options.forceUpperLower force at least one upper and lower
 * @param {string} options.custom characters to be included in the pool
 * @returns {string} generated password
 */
passwords.utils.generateWithOptions = ({ length = 16, lowercase = true, uppercase = true, numbers = true, symbols = true, space = false, ambiguous = false, forceSymbol = false, forceNumber = false, forceUpperLower = false, custom = '' } = {}) => {
	let pool = '';

	// Build the pool of characters
	if (lowercase) pool += LOWERCASE;
	if (uppercase) pool += UPPERCASE;
	if (numbers) pool += NUMBERS;
	if (symbols) pool += SYMBOLS;
	if (space) pool += ' ';
	if (!ambiguous) pool = pool.difference(AMBIGUOUS_CHARACTERS);
	pool += custom;
	// Remove duplicate character bias
	pool = pool.unique();

	// Generate a base password
	let password = passwords.utils.generate(length, pool);

	// Modify password to meet requirements
	// Generate indexes for making modifications
	let indexes = Array.from(Array(password.length).keys()).shuffle();
	if (forceSymbol === true) {
		password = forceOption(password, indexes, pool, SYMBOLS, 'forceSymbol', 'symbol');
	}
	if (forceNumber === true) {
		password = forceOption(password, indexes, pool, NUMBERS, 'forceNumber', 'number');
	}
	if (forceUpperLower === true) {
		password = forceOption(password, indexes, pool, LOWERCASE, 'forceUpperLower', 'lower case');
		password = forceOption(password, indexes, pool, UPPERCASE, 'forceUpperLower', 'upper case');
	}

	return password;
};

/**
 * Generates a random password with the given length and character pool.
 * This function DOES NOT check for duplicate characters in characterPool. Multiple of the same character will increase the liklihood of appearing in password.
 * @param {Number} length length of the password
 * @param {string} characterPool pool of characters to use for generating the password
 */
passwords.utils.generate = (length = 16, characterPool = ALL_CHARACTERS) => {
	let password = '';
	for (let i = 0; i < length; i++) {
		const poolIndex = crypto.randomInt(characterPool.length - 1);
		password += characterPool[poolIndex];
	}
	return password;
};

module.exports = passwords;
