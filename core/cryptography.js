/**
 * A simplified library of cryptography functions used for this app
 */
const crypto = require('crypto');
const log = require('loglevel');

// For module.exports
const cryptography = {};

/**
 * One way hash that will generate a salt
 * @param {string} plaintext the plaintext to be hashed
 * @param {string} salt hex encoded salt string (length 32)
 * @returns Object { salt: <salt>, hash: <hash> }
 */
cryptography.hash = (plaintext, salt) => {
	if (salt == undefined) {
		salt = crypto.randomBytes(16).toString('hex');
	}
	const hash = crypto.createHmac('sha512', salt);
	hash.update(plaintext);
	const value = hash.digest('hex');
	return {
		salt: salt,
		hash: value
	};
};

/**
 * @param {string} plaintext plaintext
 * @param {string} key the cipher key
 * @param {string} iv initialization vector hex encoded string (length 32)
 */
cryptography.encrypt = (plaintext, key, iv) => {
	if (iv == undefined) {
		iv = crypto.randomBytes(16);
	} else if (typeof iv === 'string') {
		iv = Buffer.from(iv, 'hex');
	}
	// Hash key to 256 bit
	const hashedkey = crypto.createHash('sha256').update(key).digest();
	let cipher = crypto.createCipheriv('aes-256-cbc', hashedkey, iv);
	let encrypted = cipher.update(plaintext);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return {
		ciphertext: encrypted.toString('hex'),
		iv: iv.toString('hex')
	};
};

/**
 * @param {string} ciphertext ciphertext
 * @param {string} key the cipher key
 * @param {string} iv initialzation vector hex encoded string
 */
cryptography.decrypt = (ciphertext, key, iv) => {
	// Hash key to 256 bit
	const hashedkey = crypto.createHash('sha256').update(key).digest();
	let ivBuffer = Buffer.from(iv, 'hex');
	let encryptedText = Buffer.from(ciphertext, 'hex');
	let decipher = crypto.createDecipheriv('aes-256-cbc', hashedkey, ivBuffer);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
};

module.exports = cryptography;
