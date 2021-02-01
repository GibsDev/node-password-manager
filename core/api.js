const express = require('express');
const api = express.Router();
const auth = require('./auth.js');
const passwords = require('./passwords.js');

/**
 * Middleare function to intercept every request made to the API node
 */
function apiRequest(req, res, next) {
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
 * Gets a raw password
 */
api.get('/passwords/:id', (req, res) => {
	const key = req.get('X-API-Key');
	if (key) {
		console.log(`POST key '${key}' to /passwords/${req.params.id}`);
		passwords.get(req.user, req.params.id, key).then(password => {
			res.setHeader('Content-Type', 'application/json');
			return res.send(JSON.stringify(password));
		}).catch(err => {
			console.log('Invalid key');
			return res.status(403).send('Invalid key');
		});
	}
	passwords.get(req.user, req.params.id).then(password => {
		res.setHeader('Content-Type', 'application/json');
		return res.send(JSON.stringify(password, null, 4));
	});
});

/**
 * Inserts a password into the manager
 */
api.post('/passwords', (req, res) => {
	// TODO insert password
	// Let the id be specified by the url? /:id ?
});

module.exports = api;
