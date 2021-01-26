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

// Authenticate the request to the api
api.use(auth);

// A secret test resource
api.get('/secret', (req, res) => {
    res.send('You are logged in!');
});

api.get('/passwords', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    passwords.getNames(req.user).then(names => {
        let obj = {
            passwords: names
        };
        res.send(JSON.stringify(obj, null, 4));
    });
});

api.post('/passwords', (req, res) => {
    // TODO insert password
});

module.exports = api;