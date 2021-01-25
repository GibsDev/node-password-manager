const { json } = require('express');
const jsonfile = require('jsonfile');
const fs = require('fs');
const cryptography = require('./cryptography.js');

// User storage file
const userfile = 'users.json';
const passwordDir = './passwords';

// For module.exports
let database = {};

/**
 * Stores the user into the database with a one way password hash
 * @param {string} username username
 * @param {string} password password
 */
database.createUser = (username, password) => {
    let users = readUsers();
    let encrypted = cryptography.hash(password);
    users[username] = {
        password: encrypted.hash,
        salt: encrypted.salt
    };
    writeUsers(users);
    ensurePasswordFolder();
    createPasswordFile(username);
};

/**
 * Checks if the given credentials are valid
 * @param {string} username username
 * @param {string} password password
 * @return {boolean} if the credentials are valid
 */
database.verifyUser = (username, password) => {
    let users = readUsers();
    let hashedpassword = users[username];
    let encrypted = cryptography.hash(password, hashedpassword.salt);
    return users[username].password == encrypted.hash;
};

/**
 * Gets the js object of the users.json file.
 * Creates users.json if it doesn't exist
 */
function readUsers() {
    // Create users.json if it does not exist
    if (!fs.existsSync(userfile)) {
        writeUsers({});
    }
    return jsonfile.readFileSync(userfile);
}

/**
 * Saves the state of the given object to the users.json file
 * @param {object} users the users json object
 */
function writeUsers(users) {
    jsonfile.writeFileSync(userfile, users, { spaces: 4 });
}

function ensurePasswordFolder() {
    if (!fs.existsSync(passwordDir)) {
        fs.mkdirSync(passwordDir);
    }
}

function createPasswordFile(username) {
    let file = passwordDir + '/' + username + '.json';
    if (!fs.existsSync(file)) {
        jsonfile.writeFileSync(file, {}, { spaces: 4 });
    }
}

module.exports = database;