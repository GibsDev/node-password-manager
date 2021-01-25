const express = require('express');
const app = express();
const api = require('./api.js');
const port = 30000;

/**
 * A middleware function for inspecting every request to the server
 */
function requestInspector(req, res, next) {
    console.log(`\n${req.method} ${req.url}`);
    next();
}
app.use(requestInspector);

// Initialize the api router
app.use('/api', api);

// Server statis files from public folder
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
