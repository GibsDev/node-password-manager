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

// Initialize the api router
app.use('/api', api);

app.get('/', auth, (req, res) => {
	if (req.accepts('html')) {
		res.sendFile(path.resolve(__dirname, 'index.html'));
	}
});

app.get('/login', (req, res) => {
	if (req.accepts('html')) {
		res.sendFile(path.resolve(__dirname, 'login.html'));
	}
});

app.get('/passwords', auth);

// Server statis files from public folder
app.use(express.static('public'));

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
