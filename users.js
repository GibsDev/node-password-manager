const cryptography = require('./cryptography.js');
const database = require('./database.js');

const users_db = 'users'; // End node

class User {

    constructor(username, password) {
        this.username = username;
        this.password = cryptography.hash(password);
    }

}

let users = {};

/**
 * Create a user and insert them into the database.
 * This will overwrite a user with the same username.
 * Overwriting user is essentially the same thing as changing the password.
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<void>} when the user has been inserted
 */
users.create = (username, password) => {
    let user = new User(username, password);
    let dbobj = {
        password: user.password.hash,
        salt: user.password.salt
    };
    return database.put(users_db, username, dbobj);
}

/**
 * Verify the users credentials are correct
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<void>} resolves if the users credentials are valid
 */
users.verify = (username, password) => {
    return new Promise((resolve, reject) => {
        database.get(users_db, username).then(dbobj => {
            let hash = cryptography.hash(password, dbobj.salt);
            if (dbobj.password == hash) resolve();
            reject(new Error('Password hash did not match'));
        }).catch(err => reject(err));
    });
};

module.exports = users;