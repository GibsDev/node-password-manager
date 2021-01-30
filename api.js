const express = require('express');
const api = express.Router();
const auth = require('./auth.js');
const passwords = require('./passwords.js');

/**
 * Middleare function to intercept every request made to the API node
 */
function apiRequest (req, res, next) {
	console.log(`API request: ${req.method} ${req.url}`);
	next();
}
api.use(apiRequest);

/**
 * Authenticate the request to the api
 */
api.use(auth);

/**
 * A test resource from the API
 */
api.get('/ping', (req, res) => {
	res.send('Pong');
});

/**
 * Gets a list of all password names (ids)
 */
api.get('/passwords', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	passwords.getNames(req.user).then(names => {
		const obj = {
			passwords: names
		};
		res.send(JSON.stringify(obj, null, 4));
	});
});

/**
 * Inserts a password into the manager
 */
api.post('/passwords', (req, res) => {
	// TODO insert password
});

module.exports = api;
