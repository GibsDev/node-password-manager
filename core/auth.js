/**
 * Middleware to authorize requests using JWT tokens
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const log = require('loglevel');
const express = require('express');
const nodemailer = require('nodemailer');
const users = require('./users.js');
const config = require('./config.js');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const cookieParser = require('cookie-parser')();

// Create mailer from config
const emailer = nodemailer.createTransport(config.two_factor_auth.nodemail_transporter);

const NO_AUTH = process.argv.includes('--noauth');
const NO_AUTH_USERNAME = 'noauth';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// For module.exports
const auth = express.Router();

// Generate a private key for signing JWT tokens each time the server starts
// Key for sessions
const SESSION_PRIVATE_KEY = crypto.randomBytes(16).toString('hex');
// Key for two factor authentication
const TWO_FACTOR_PRIVATE_KEY = crypto.randomBytes(16).toString('hex');

// Hard coded value for how long tokens last (milliseconds)
const TOKEN_TIME = config.token_time;

// The identifier used for storing JWT token in cookies
const SESSION_JWT_COOKIE_NAME = 'session';
const TWO_FACTOR_JWT_COOKIE_NAME = 'two_factor';

/**
 * Used for handing out initial tokens and rereshing upon successful requests
 * @param {string} username the username stored in the token
 * @param {Object} res the response object to set the .cookie with
 */
function giveSessionToken(username, res) {
	const time = TOKEN_TIME;
	const token = jwt.sign({ username: username }, SESSION_PRIVATE_KEY, { expiresIn: time });
	res.cookie(SESSION_JWT_COOKIE_NAME, token, {
		maxAge: time,
		sameSite: 'Strict',
		httpOnly: true
	});
}

/**
 * Gives out a two factor authentication token
 * @param {string} username the username stored in the token
 * @param {Object} res the response object to set the .cookie with
 */
function giveTwoFactorToken(username, code, res) {
	const time = config.two_factor_auth.expiration_time;
	const token = jwt.sign({ username: username, code: code }, TWO_FACTOR_PRIVATE_KEY, {
		expiresIn: time
	});
	res.cookie(TWO_FACTOR_JWT_COOKIE_NAME, token, {
		maxAge: time,
		sameSite: 'Strict',
		httpOnly: true
	});
}

/**
 * Send a two factor authentication email
 * @param {string} username
 * @return {Promise<void>} when the email has been sent
 */
function sendTwoFactorEmail(emailAddress, code) {
	return new Promise(async (resolve, reject) => {
		const email = {
			from: `"${config.two_factor_auth.email_name}" <${config.two_factor_auth.nodemail_transporter.auth.user}>`,
			to: emailAddress,
			subject: 'Authentication Code ' + (new Date()).toISOString(),
			text: `Use this code to login: ${code}`,
			html: `<p>Use this code to login: <strong>${code}</strong></p>`
		};
		try {
			const info = await emailer.sendMail(email);
			log.debug(info);
		} catch (e) {
			reject(e);
		}
		resolve();
	});
}

/**
 * Enable cookie parsing
 */
auth.use(cookieParser);


/**
 * Node for confirming two factor authentication
 */
auth.post('/auth', express.json(), async (req, res) => {
	const code = req.body.code;
	// Check for JWT in HTTP cookies
	const cookieToken = req.cookies[TWO_FACTOR_JWT_COOKIE_NAME];
	let username = 'unknown';
	try {
		const decoded = validateToken(cookieToken, TWO_FACTOR_PRIVATE_KEY);
		username = decoded.username;
		if (Number(code) === Number(decoded.code)) {
			giveSessionToken(decoded.username, res);
			return res.clearCookie(TWO_FACTOR_JWT_COOKIE_NAME).send('Success');
		} else {
			throw new Error('Invalid code in JWT token');
		}
	} catch (err) {
		log.info(`Cant validate '${username}'s authentication code`);
		log.debug(err);
		return res.status(401).send('Invalid code');
	}
});

/**
 * Node for handing out JWT tokens (or handing out intermediate two factor authentication tokens)
 */
auth.post('/login', express.json(), async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	log.info(`'${username}' is attempting to login`);
	if (username === NO_AUTH_USERNAME) {
		if (!NO_AUTH) {
			log.info(`'--noauth' is not enabled`);
			return res.status(401).send('Invalid login');
		} else if (!IS_DEVELOPMENT) {
			log.info(`User '${NO_AUTH_USERNAME}' is not available in production mode`);
			return res.status(401).send('Invalid login');
		}
	}
	try {
		await users.verify(username, password);
		const twoFactorEmail = await users.getTwoFactorEmail(username);
		if (config.two_factor_auth.enabled && twoFactorEmail) {
			// User has 2FA enabled
			log.info(`'${username}' started two factor authentication`);
			// Generate code
			const code = crypto.randomInt(100000, 999999);
			// Set the token on the client
			giveTwoFactorToken(username, code, res);
			// Email the code to the configured email
			await sendTwoFactorEmail(twoFactorEmail, code);
			// Let the client know 2FA is required
			return res.status(201).send('Two factor authentication required');
		} else {
			// User does not have 2FA enabled
			giveSessionToken(username, res);
			log.info(`'${username}' logged in`);
			return res.send('Success');
		}
	} catch (err) {
		log.info(`'${username}' failed to login`);
		log.debug(err);
		return res.status(401).send('Invalid login');
	}
});

/**
 * Used to logout a user
 */
auth.get('/logout', (req, res) => {
	try {
		const username = validateToken(req.cookies[SESSION_JWT_COOKIE_NAME], SESSION_PRIVATE_KEY).username;
		log.info(`'${username}' logged out`);
	} catch (err) {
		log.debug('Someone who was not logged in tried to logout');
		log.debug(err);
	}
	return res.clearCookie(TWO_FACTOR_JWT_COOKIE_NAME)
		.clearCookie(SESSION_JWT_COOKIE_NAME)
		.redirect('/');
});

/**
 * Middleware function for authorizing HTTP requests. It will check for a valid token
 * in the 'Authorization' header first. Then it will check for a valid token in HTTP cookies
 * It also attatches a ['user'] (.user) property to the req object upon successful
 * authorization for downstream request interpretters.
 */
function authorize(req, res, next) {
	log.debug(`Authorizing: ${req.url}`);

	if (NO_AUTH && IS_DEVELOPMENT) {
		log.debug(`Authorization disabled, req.user = 'noauth'`);
		req.user = NO_AUTH_USERNAME;
		return next();
	}

	// Default error message
	let errorMessage = 'Unauthorized: No tokens';

	// Check JWT in the 'Authorization' header
	const authorization = req.headers.authorization;
	// 'Bearer <token>' (or undefined)
	log.debug(`Authorization header: ${authorization}`);
	if (authorization) {
		const authHeaderToken = authorization.split(' ')[1];
		// Check validity of token
		try {
			const username = validateToken(authHeaderToken, SESSION_PRIVATE_KEY).username;
			// Add the .user object to the req object for future request processors
			req.user = username;
			giveSessionToken(req.user, res);
			return next();
		} catch (err) {
			errorMessage = 'Authorization header token error: ' + err.message;
		}
	}

	// Check for JWT in HTTP cookies
	const cookieToken = req.cookies[SESSION_JWT_COOKIE_NAME];
	if (cookieToken) {
		// Check validity of token
		try {
			const username = validateToken(cookieToken, SESSION_PRIVATE_KEY).username;
			// Add the .user object to the req object for future request processors
			req.user = username;
			giveSessionToken(req.user, res);
			return next();
		} catch (err) {
			log.debug(err);
			errorMessage = 'Cookie token error: ' + err.message;
			// Remove invalid JWT from cookies;
			res.clearCookie(SESSION_JWT_COOKIE_NAME);
		}
	}

	if (req.accepts('html')) {
		log.debug('Redirecting unauthorized request');
		// req.url is relative to where this middlware function is intercepting
		// req.originalUrl is the full path
		// Set redirect for after login
		let redirect = '?returnurl=' + encodeURIComponent(req.originalUrl);
		return res.redirect('/login' + redirect);
	} else {
		return res.status(401).send(errorMessage);
	}
}
auth.use(authorize);

/**
 * Validates a given JWT token
 * @param token The JWT token string to be verified
 * @param private_key The secret used for encoding/decoding JWT token
 * @throws an error if the token is invalid
 * @returns The object encoded in the token
 */
function validateToken(token, private_key) {
	try {
		log.trace(`Token: ${token}`);
		const decoded = jwt.verify(token, private_key);
		// Override username to noauth if enabled
		if (NO_AUTH) {
			if (IS_DEVELOPMENT) {
				decoded.username = NO_AUTH_USERNAME;
			} else {
				throw new Error(`'noauth' user can only be used in development mode`);
			}
		}
		log.trace('Successfullly validated token: ', decoded);
		return decoded;
	} catch (err) {
		log.debug(err);
		if (err instanceof JsonWebTokenError) {
			throw new Error('Token invalid');
		} else if (err instanceof TokenExpiredError) {
			throw new Error('Token expired');
		} else {
			throw new Error('Token error');
		}
	}
}

module.exports = auth;
