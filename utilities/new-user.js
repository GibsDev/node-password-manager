/**
 * Command line utitlity to create an account
 */
const prompt = require('prompt');
const users = require('../core/users.js');

prompt.message = '';
prompt.start();

prompt.get([
	{ name: 'username', required: true },
	{ name: 'password', required: true, hidden: true }
], (err, results) => {
	users.create(results.username, results.password);
	console.log('Account created');
});
