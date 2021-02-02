const express = require('express');
const app = express();
const api = require('./api.js');
const auth = require('./auth.js');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const port = 30000;

const USE_HTTPS = process.argv.includes('--https');
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/**
 * A middleware function for inspecting every request to the server
 */
function requestInspector(req, res, next) {
	console.log(`\n${req.method} ${req.url}`);
	next();
}
app.use(requestInspector);

/**
 * Initialize the api router
 */
app.use('/api', api);

/**
 * Replaces references of `/dist/` to `/dist-dev/' in html file
 * @param {string} filename path of the file 
 */
const getDevHTML = async (filename) => {
	let html = await (await readFileAsync(filename, 'utf8')).toString();
	if (IS_DEVELOPMENT) {
		html = html.replace(/\/dist\//g, '/dist-dev/');
	}
	return html;
};

/**
 * Send the user the password manager
 * If the client is not yet authorized, they will be redirected to login by the auth router
 */
app.get('/', auth, async (req, res) => {
	if (req.accepts('html')) {
		const file = path.resolve(__dirname, '../pages/index.html');
		if (IS_DEVELOPMENT) {
			return res.send(await getDevHTML(file));
		}
		return res.sendFile(file);
	}
});

/**
 * Sends the user a page where they can login to obtain an auth token cookie
 */
app.get('/login', async (req, res) => {
	if (req.accepts('html')) {
		const file = path.resolve(__dirname, '../pages/login.html');
		if (IS_DEVELOPMENT) {
			return res.send(await getDevHTML(file));
		}
		return res.sendFile(file);
	}
});

/**
 * Servers static content at the root node (/)
 */
app.use(express.static(path.resolve(__dirname, '../public')));

/**
 * Start the server
 */
if (USE_HTTPS) {
	const https = require('https');
	const fs = require('fs');

	const options = {
		key: fs.readFileSync('./server.key'),
		cert: fs.readFileSync('./server.cert')
	};
	https.createServer(options, app).listen(port, () => {
		console.log(`Password Manager Server listening at https://localhost:${port}`);
	});

} else {
	app.listen(port, () => {
		console.log(`Password Manager Server listening at http://localhost:${port}`);
	});
}

