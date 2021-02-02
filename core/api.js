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
	passwords.getNames(req.user).then(names => {
		const obj = {
			passwords: names
		};
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('Cache-Control', 'no-store');
		return res.send(JSON.stringify(obj, null, 4));
	});
});

/**
 * Gets a raw password
 */
api.get('/passwords/:id', (req, res) => {
	const key = req.get('X-API-Key');
	if (key) {
		console.log(`GET key '${key}' from /passwords/${req.params.id}`);
		passwords.get(req.user, req.params.id, key).then(password => {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Cache-Control', 'no-store');
			return res.send(JSON.stringify(password));
		}).catch(err => {
			console.log(err);
			console.log('Invalid key');
			return res.status(403).send('Invalid key');
		});
	} else {
		passwords.get(req.user, req.params.id).then(password => {
			// Remove encrypted info
			delete password.username;
			delete password.password;
			delete password.pinfo;
			delete password.iv;
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Cache-Control', 'no-store');
			return res.send(JSON.stringify(password, null, 4));
		}).catch(err => {
			console.log('Could not get password');
			console.log(err);
			return res.status(404).send('Invalid key');
		});
	}
});

/**
 * Inserts a password into the manager
 */
api.post('/passwords', express.json(), (req, res) => {
	console.log(`'${req.user}' is attempting to insert a password`);
	const pw = req.body;
	// In the case the incoming password uses 'username' instead of 'user'
	if (pw['username']) pw.user = pw['username'];
	// In the case the incoming password uses 'password' instead of 'pass'
	if (pw['password']) pw.pass = pw['password'];
	pw.username = req.user;
	passwords.put(pw.username, pw.name, pw.user, pw.pass, pw.info, pw.pinfo, pw.key).then(() => {
		return req.send('Password inserted');
	}).catch(err => {
		return res.send(err);
	});
});

module.exports = api;
