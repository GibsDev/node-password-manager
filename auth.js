/**
 * Middlware to authorize requests using JWT tokens
 */
const jwt = require('jsonwebtoken');
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken');
const express = require('express');
const auth = express.Router();
const cookieParser = require('cookie-parser');
const users = require('./users.js');
const crypto = require('crypto');

// Generate a private key for signing JWT tokens each time the server starts
const privateKey = crypto.randomBytes(16).toString('hex');

// TODO configure this in dotenv
// Hard coded value for how long tokens last
const token_time = 60 * 1000; // milliseconds

// The identifier used for storing JWT token in cookies
const jwtCookieName = 'jwt';

// Enable cookie parsing
auth.use(cookieParser());

// Node for handing out JWT tokens
auth.post('/login', express.json(), (req, res) => {
    console.log('Logging someone in...');
    console.log(req.body.username);
    users.verify(req.body.username, req.body.password).then(() => {
        let token = jwt.sign({ username: req.body.username }, privateKey, { expiresIn: token_time });
        res.cookie(jwtCookieName, token, { maxAge: token_time });
        res.type('application/json');
        res.send(JSON.stringify({ token: token }));
    }).catch((err) => {
        console.log(err);
        res.status(401).send('Invalid login');
        return;
    });
});

/**
 * Middleware function for authorizing HTTP requests. It will check for a valid token
 * in the 'Authorization' header first. Then it will check for a valid token in HTTP cookies
 * It also attatches a ['user'] (.user) property to the req object upon successful
 * authorization for downstream request interpretters.
 */
function authorize(req, res, next) {
    console.log(`Authorizing: ${req.url}`);

    // Default error message
    let errorMessage = 'Unauthorized: No tokens';

    // Check JWT in the 'Authorization' header
    let authorization = req.headers.authorization;
    // 'Bearer <token>' (or undefined)
    console.log(`Authorization header: ${authorization}`);
    if (authorization) {
        let token = authorization.split(' ')[1];
        // Check validity of token
        try {
            validateToken(req, token);
            next();
            return;
        } catch (err) {
            errorMessage = 'Authorization header token error: ' + err.message;
        }
    }

    // Check for JWT in HTTP cookies
    let cookieToken = req.cookies[jwtCookieName];
    if (cookieToken) {
        // Check validity of token
        try {
            validateToken(req, cookieToken);
            next();
            return;
        } catch (err) {
            errorMessage = 'Cookie token error: ' + err.message;
            // Remove invalid JWT from cookies;
            res.clearCookie(jwtCookieName);
        }
    }

    res.status(401);
    // TODO check if client can accept redirect and send redirect
    res.send(errorMessage);
}
auth.use(authorize);

/**
 * Validates a given JWT token
 * @param token The JWT token string to be verified
 * @throws Will throw an error if the token is invalid
 */
function validateToken(req, token) {
    try {
        console.log(`Token: ${token}`);
        let decoded = jwt.verify(token, privateKey);
        console.log('Successfullly validated token: ', decoded);
        // Add the .user object to the req object for future request processors
        req.user = decoded.username;
    } catch (err) {
        console.log(err);
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