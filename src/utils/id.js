const tools = {};

// Generate a random unique id prefix if title is not provided
let _id = Math.floor(Math.random() * Math.floor(0xFFFFFFFF));

// Generates a reasonably human readable id for html elements
tools.htmlId = (...strings) => {
	let id = '';
	for (const string of strings) {
		id += string.toLowerCase() + '_';
	}
	// Replace all illegal letters with underscore
	id = id.replace(/([^a-zA-Z0-9\:\-\.\_]| )/g, '_');

	// Remove leading and trailing underscores
	id = id.replace(/_+$/, '');
	id = id.replace(/^_+/, '');
	// Remove inner repeating underscores
	while(id.includes('__')){
		id = id.replace('__', '_');
	}
	return id;
};

tools.nextId = () => {
	return (++_id).toString(16);
};

module.exports = tools;