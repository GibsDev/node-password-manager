const express = require('express');
const api = express.Router();
const auth = require('./auth.js');

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
    res.send(`Hi ${req.user}, here is a secret!`);
});

module.exports = api;