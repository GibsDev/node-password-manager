/**
 * Middleware to authorize requests using JWT tokens
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const log = require('loglevel');
const express = require('express');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const cookieParser = require('cookie-parser')();
const users = require('./users.js');

const NO_AUTH = process.argv.includes('--noauth');
const AUTH_USERNAME = 'noauth';

// For module.exports
const auth = express.Router();

// Generate a private key for signing JWT tokens each time the server starts
const PRIVATE_KEY = crypto.randomBytes(16).toString('hex');

// Hard coded value for how long tokens last (milliseconds)
const TOKEN_TIME = 60 * 1000 * 5; // TODO configure this in dotenv

// The identifier used for storing JWT token in cookies
const JWT_COOKIE_NAME = 'jwt';

/**
 * Useed for handing out initial tokens and rereshing upon successful requests
 * @param {string} username the username stored in the token
 * @param {Object} res the response object to set the .cookie with
 */
function giveFreshToken(username, res) {
	const token = jwt.sign({ username: username }, PRIVATE_KEY, { expiresIn: TOKEN_TIME });
	res.cookie(JWT_COOKIE_NAME, token, { maxAge: TOKEN_TIME, sameSite: 'Strict', httpOnly: true });
}

/**
 * Enable cookie parsing
 */
auth.use(cookieParser);

/**
 * Node for handing out JWT tokens
 */
auth.post('/login', express.json(), async (req, res) => {
	log.info(`'${req.body.username}' is attempting to login`);
	try {
		await users.verify(req.body.username, req.body.password);
		giveFreshToken(req.body.username, res);
		log.info(`'${req.body.username}' logged in`);
		return res.send('Success');
	} catch (err) {
		log.info(`'${req.body.username}' failed to login`);
		log.debug(err);
		return res.status(401).send('Invalid login');
	}
});

/**
 * Used to logout a user
 */
auth.get('/logout', (req, res) => {
	try {
		const username = validateToken(req.cookies[JWT_COOKIE_NAME]);
		log.info(`'${username}' logged out`);
	} catch (err) {
		log.debug('Someone who was not logged in tried to logout');
		log.debug(err);
	}
	return res.clearCookie(JWT_COOKIE_NAME).redirect('/');
});

/**
 * Middleware function for authorizing HTTP requests. It will check for a valid token
 * in the 'Authorization' header first. Then it will check for a valid token in HTTP cookies
 * It also attatches a ['user'] (.user) property to the req object upon successful
 * authorization for downstream request interpretters.
 */
function authorize(req, res, next) {
	log.debug(`Authorizing: ${req.url}`);

	if (NO_AUTH) {
		log.debug(`Authorization disabled, req.user = 'noauth'`);
		req.user = AUTH_USERNAME;
		return next();
	}

	// Default error message
	let errorMessage = 'Unauthorized: No tokens';

	// Check JWT in the 'Authorization' header
	const authorization = req.headers.authorization;
	// 'Bearer <token>' (or undefined)
	log.debug(`Authorization header: ${authorization}`);
	if (authorization) {
		const token = authorization.split(' ')[1];
		// Check validity of token
		try {
			const username = validateToken(token);
			req.user = username;
			giveFreshToken(req.user, res);
			return next();
		} catch (err) {
			errorMessage = 'Authorization header token error: ' + err.message;
		}
	}

	// Check for JWT in HTTP cookies
	const cookieToken = req.cookies[JWT_COOKIE_NAME];
	if (cookieToken) {
		// Check validity of token
		try {
			const username = validateToken(cookieToken);
			req.user = username;
			giveFreshToken(req.user, res);
			return next();
		} catch (err) {
			log.debug(err);
			errorMessage = 'Cookie token error: ' + err.message;
			// Remove invalid JWT from cookies;
			res.clearCookie(JWT_COOKIE_NAME);
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
 * @throws an error if the token is invalid
 * @returns The username from the auth token. The user will always be 'noauth' if --noauth enabled
 */
function validateToken(token) {
	if (NO_AUTH) return AUTH_USERNAME;

	try {
		log.trace(`Token: ${token}`);
		const decoded = jwt.verify(token, PRIVATE_KEY);
		log.trace('Successfullly validated token: ', decoded);
		// Add the .user object to the req object for future request processors
		return decoded.username;
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
