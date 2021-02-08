# Password Manager

A password manager webserver that runs on NodeJS. Make sure to use HTTPS!

## Getting started

- Clone this repository into your local workspace.
- Make sure that the front end is built: `npm run build`
The latest version should already be built and commited to the repository, but this step ensures you are running the latest code.
- Start the webserver: `npm start`
- Open your web browser to `localhost:30000`
- Access your password

## Development

To begin modifying code yourself, start the server in development mode:
`npm run start:dev`

This will set `NODE_ENV` to `development` and will start the server in development mode. Nodemon will automatically restart the server when applicable files are modified. Webpack will be running in watch mode, and will rebuild the fronend when changes are made. The only time you should need to manually restart is if you make changes to `webpack.config.js`.

You may notice that each time you make a change, you will need to login again. This is because the server restarts and authentication data is not persistant. So if you are not working on authentication behavior, you should start the server with the `--noauth` flag by using the built in script:
`npm run start:dev:noauth`

When the server is running in this mode, all requests will automatically be authenticated using the `noauth` user. The behavior of the application will be as a user named `noauth` who never had to login. This is usefuly when you are working on front end code that you want to test quickly. Currently, you need to manually create the noauth user using `/utilities/new-user.js`.

## `package.json` scripts

### `build`

`cross-env NODE_ENV=production npx webpack`

Builds the production frontend
NODE_ENV is an environment variable that node recognizes. Packages like webpack are also aware of it.
`cross-env` gives cross platform syntax consistency for setting environment variables

### `start`

`node server.js`

Starts server.js

### `start:dev`

`concurrently -n "webpack,server" "cross-env NODE_ENV=development npx webpack" "cross-env NODE_ENV=development nodemon server.js"`

Registers the githook script in the case a developer makes changes that need to be built for production.

Starts the server using nodemon for auto restarts on crashes and changes.

Starts webpack (it will default to watch mode because of the development flag)

### `start:dev:noauth`

`concurrently -n "webpack,server" "cross-env NODE_ENV=development npx webpack" "cross-env NODE_ENV=development nodemon server.js --noauth"`

Same as start dev, but enables the `--noauth` flag. Every time the server restarts (from nodemon), a new token for JWT encryption is created so this flag makes every request validate automatically in the auth.js router. The username for JWT token will always be `noauth`, and the `req.user` property will also be `noauth`.

In order to have test data while developing, you will need to create a user using `node ./utilities/new-user.js` with the `noauth` username. The password for the `noauth` is never checked so you can make it whatever you want, but it can't be empty. You will also need to create test passwords using `node ./utilities/new-pass.js` for the `noauth` user.

## JWT schema

- Client sends username and password to server.
- Server sends back JWT with the users username in the payload.
- Each subsequent request from the client includes the JWT token in the HTTP cookie until it expires
- On each request the server verifies the JWT token and gets the username of the person sending the request
- When the JWT is verified by the server (auth.js) it injects a req.user property so subsequent request processors have access to the user making the request. This way the server now has the ability to serve content specific to that username

## Resource structure
```
app (server)
bound: [root] /
provides:
    - / (index.html)
    - /login (login.html)

public (static file serve)
bound: [app] /
provides: files in /public folder (GET)

api (router)
bound: [app] /api/
provides:
    - /passwords (GET, POST)
    - /ping (GET)

auth (router)
bound: [api] /
provides:
    - /login (POST)
```

## JSON objects and structures
```
User object (don't store plaintext passwords)
{
    username: <username>,
    password: {
        salt: <salt>,
        hash: <hash>
    }
}

Password object
{
    name: <password name>
    username: <login username>,
    password: <login password>,
    info: <public info>,
    pinfo: <private information>
}

Encrypted Password object
{
    name: <name of the password>,
    username: <encrypted string>,
    password: <encrypted string>,
    info: <some unencrypted string about this password>,
    pinfo: <encrypted string about this password>,
    iv: <initialization vector string>
}

```

## Storage schema

File structure:
```
database.js

/database
    users.json
    /passwords
        <user1>.json
        <user2>.json
```

`/database/users.json`
```
{
    <username1>: {
        password: <hash>,
        salt: <salt>
    },
    <username2>: {
        password: <hash>,
        salt: <salt>
    },
    ...
}
```

`/database/passwords/<exampleuser>.json`
```
{
    "<name>": {
        "name": "<name>",
        "username": "<encrypted hex string>",
        "password": "<encrypted hex string>",
        "info": "<some plaintext info>",
        "pinfo": "<encrypted hex string>",
        "iv": "<hex string>"
    },
    ...
}
```

## Hosting

Make sure you are using an HTTPS enabled connection! Note that this does not necessarily require you to start the server in HTTPS mode. If you are connecting to a webserver via HTTPS and the traffic is forwarded to a locally running instance of this application then unencrypted traffic will not leave the server.

In order for the NodeJS server to be visible on shared hosting, you need to setup an .htaccess rewrite rule to proxy traffic from the subdomain to the local NodeJS webserver.

`.htaccess` located in the subdomain public_html folder
```
DirectoryIndex disabled

RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]


# Proxy for NodeJS app
RewriteRule ^$ http://127.0.0.1:30000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:30000/$1 [P,L]

```