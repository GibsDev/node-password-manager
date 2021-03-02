const fs = require('fs');
const jsonfile = require('jsonfile');
const path = require('path');
let defaultConfig = {};
try {
	defaultConfig = jsonfile.readFileSync(path.resolve(__dirname, '../default-config.json'));
	delete defaultConfig._comment;
} catch (e) {
	console.error(e);
	console.log('Default config does not exist!');
	process.exit(1);
}

let config = {};
try {
	config = jsonfile.readFileSync(path.resolve(__dirname, '../config.json'));
} catch (e) {}

// Similar to Object.assign, but it will handle nested objects
function overwriteObj(original, overwrite) {
	if (!overwrite) {
		return original;
	}
	const level = {};
	for (const key in original) {
		if (typeof original[key] === 'object') {
			level[key] = overwriteObj(original[key], overwrite[key]);
		} else {
			level[key] = (overwrite[key]) ? overwrite[key] : original[key];
		}
	}
	for (const key in overwrite) {
		if (!Object.keys(original).includes(key)) {
			level[key] = overwrite[key];
		}
	}
	return level;
}

module.exports = overwriteObj(defaultConfig, config);