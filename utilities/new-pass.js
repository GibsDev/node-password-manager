/**
 * Command line utitlity to create an account
 */
const prompt = require('prompt');
const passwords = require('../passwords.js');

prompt.message = '';
prompt.start();

prompt.get([
	{ name: 'user', required: true },
	{ name: 'name', required: true },
	{ name: 'username', required: true },
	{ name: 'password', required: true, hidden: true },
	{ name: 'info', required: true },
	{ name: 'pinfo', required: true },
	{ name: 'key', required: true }
], (err, r) => {
	passwords.put(r.user, r.name, r.username, r.password, r.info, r.pinfo, r.key);
	console.log('Password created');
});
