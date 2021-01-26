/**
 * A simplified library of cryptography functions used for this app
 */
const crypto = require('crypto');

let cryptography = {};

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
    let hash = crypto.createHmac('sha512', salt);
    hash.update(plaintext);
    let value = hash.digest('hex');
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
    let hashedkey = crypto.createHash('sha256').update(key).digest();
    let cipher = crypto.createCipheriv('aes256', hashedkey, iv);
    cipher.update(plaintext);
    let ciphertext = cipher.final('hex');
    return {
        ciphertext: ciphertext,
        iv: iv.toString('hex')
    }
};

/**
 * @param {string} ciphertext ciphertext
 * @param {string} key the cipher key
 * @param {string} iv initialzation vector hex encoded string
 */
cryptography.decrypt = (ciphertext, key, iv) => {
    // Hash key to 256 bit
    let hashedkey = crypto.createHash('sha256').update(key).digest();
    let decipher = crypto.createDecipheriv('aes256', hashedkey, Buffer.from(iv, 'hex'));
    decipher.update(ciphertext, 'hex');
    return decipher.final('utf8');
};

module.exports = cryptography;