const express = require('express');
const app = express();
const api = require('./api.js');
const auth = require('./auth.js');
const path = require('path');
const port = 30000;

/**
 * A middleware function for inspecting every request to the server
 */
function requestInspector (req, res, next) {
	console.log(`\n${req.method} ${req.url}`);
	next();
}
app.use(requestInspector);

/**
 * Initialize the api router
 */
app.use('/api', api);

/**
 * Send the user the password manager
 * If the client is not yet authorized, they will be redirected to login by the auth router
 */
app.get('/', auth, (req, res) => {
	if (req.accepts('html')) {
		res.sendFile(path.resolve(__dirname, 'index.html'));
	}
});

/**
 * Sends the user a page where they can login to obtain an auth token cookie
 */
app.get('/login', (req, res) => {
	if (req.accepts('html')) {
		res.sendFile(path.resolve(__dirname, 'login.html'));
	}
});

/**
 * Servers static content at the root node (/)
 */
app.use(express.static('public'));

/**
 * Start the server
 */
app.listen(port, () => {
	console.log(`Password Manager Server listening at http://localhost:${port}`);
});
