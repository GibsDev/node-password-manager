/**
 * Command line utitlity to create an account
 */
const prompt = require('prompt');
const database = require('./database.js');

prompt.message = "";
prompt.start();

prompt.get([
    { name: 'username', required: true },
    { name: 'password', required: true, hidden: true }
], (err, results) => {
    database.createUser(results.username, results.password);
    console.log('Account created');
});
