const USE_HTTPS = process.argv.includes('--https');
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

const selfsigned = require('selfsigned');
const attrs = [{ name: 'commonName', value: 'GibsDev Password Manager' }];
const pems = selfsigned.generate(attrs, {
	keySize: 2048, // the size for the private key in bits (default: 1024)
	days: 365, // how long till expiry of the signed certificate (default: 365)
	algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
});

// Logging
const log = require('loglevel');
if (IS_DEVELOPMENT) {
	log.setDefaultLevel('debug');
} else {
	log.setDefaultLevel('info');
}
if (process.argv.includes('--trace')) {
	log.setDefaultLevel('trace');
}

const express = require('express');
const app = express();
const api = require('./api.js');
const auth = require('./auth.js');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const port = (USE_HTTPS) ? 443 : 80;

/**
 * A middleware function for inspecting every request to the server
 */
function requestInspector(req, res, next) {
	log.debug(`\n${req.method} ${req.url}`);
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
	let html = await readFileAsync(filename, 'utf8');
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
 * Alias for /api/logout (defined in auth.js)
 */
app.get('/insert', auth, async (req, res) => {
	if (req.accepts('html')) {
		const file = path.resolve(__dirname, '../pages/insert.html');
		if (IS_DEVELOPMENT) {
			return res.send(await getDevHTML(file));
		}
		return res.sendFile(file);
	}
});

/**
 * Alias for /api/logout (defined in auth.js)
 */
app.get('/logout', (req, res) => {
	res.redirect('/api/logout');
});

/**
 * Serves static content at the root node (/)
 */
app.use(express.static(path.resolve(__dirname, '../public')));

/**
 * Serves bootstrap icons 
 */
app.use('/icons', express.static(path.resolve(__dirname, '../node_modules/bootstrap-icons/icons')));

/**
 * Start the server
 */
if (USE_HTTPS) {
	const https = require('https');

	const options = {
		key: pems.private,
		cert: pems.cert
	};

	https.createServer(options, app).listen(port, () => {
		log.info(`Password Manager Server listening at https://localhost:${port}`);
	});

} else {
	app.listen(port, () => {
		log.info(`Password Manager Server listening at http://localhost:${port}`);
	});
}

