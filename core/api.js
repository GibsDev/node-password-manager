const express = require('express');
const api = express.Router();
const auth = require('./auth.js');
const passwords = require('./passwords.js');
const log = require('loglevel');

/**
 * Middleare function to intercept every request made to the API node
 */
function apiRequest(req, res, next) {
	log.debug(`API request: ${req.method} ${req.url}`);
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
	const key = req.headers['x-api-key'];
	log.trace(`x-api-key: '${key}'`);
	if (key !== undefined) {
		if (key === '') {
			log.info('Client tried to decrypt a password with empty string');
			res.status(403).send('Invalid key (empty string)');
		} 
		log.trace(`GET key '${key}' from /passwords/${req.params.id}`);
		passwords.get(req.user, req.params.id, key).then(password => {
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Cache-Control', 'no-store');
			return res.send(JSON.stringify(password));
		}).catch(err => {
			log.debug(err);
			log.info('Client provided an invalid decryption key for password');
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
			log.debug('Could not get password');
			log.debug(err);
			return res.status(404).send('Could not get password');
		});
	}
});

/**
 * Inserts a password into the manager
 */
api.post('/passwords', express.json(), (req, res) => {
	log.info(`'${req.user}' is attempting to insert a password`);
	const passObj = req.body;
	// In the case the incoming password uses 'username' instead of 'user'
	if (passObj['username']) passObj.user = passObj['username'];
	// In the case the incoming password uses 'password' instead of 'pass'
	if (passObj['password']) passObj.pass = passObj['password'];
	passObj.username = req.user;
	passwords.put(passObj.username, passObj.name, passObj.user, passObj.pass, passObj.info, passObj.pinfo, passObj.key).then(() => {
		log.info(`'${req.user}' inserted a password`);
		return req.send('Password inserted');
	}).catch(err => {
		log.debug(`Password insertion for '${req.user}' failed`);
		log.debug(err);
		return res.send(err);
	});
});

/**
 * Deletes a password
 */
api.delete('/passwords/:id', express.json(), (req, res) => {
	log.info(`'${req.user}' is attempting to delete password '${req.params.id}'`);
	passwords.delete(req.user, req.params.id).then(() => {
		log.info(`'${req.user}' deleted password '${req.params.id}'`);
		return res.status(200).end();
	}).catch(err => {
		log.info(`'${req.user}' failed to deleted password '${req.params.id}'`);
		log.debug(err);
		return res.status(404).send('Password does not exist');
	});
});


module.exports = api;
