const concurrently = require('concurrently');

// Arguments passed passed to this through npm run (after --)
const args = process.argv.slice(2).join(' ');
console.log('Starting in development mode');
console.log(`Add arguments to 'server.js' using 'npm run start:dev -- <args>'\n`);

concurrently(
	[
		{
			command: 'webpack',
			name: 'webpack',
			env: { NODE_ENV: 'development' }
		},
		{
			command: 'nodemon ./core/server.js ' + args,
			name: 'server',
			env: { NODE_ENV: 'development' }
		}
	],
	{ killOthers: ['failure', 'success'] }
);