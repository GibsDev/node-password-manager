## TODO

### Server

- Token renewal on good request
- More promise error checking/handling?
- Make passwords deletable

### Fronend

- Consider removing some props for BootstrapField and use beforeProps and afterProps instead
- Revamp Password component with new bootstrap subcomponents
- Confirm overwrite existing key
- Find a secret font that doesnt show spaces... (and matches the default password font better? maybe)
- Disable spellcheck highlighting for secret input fields if possible
- Disable autocapitalization for applicable fields
- Continue simplifying components using subcomponents
- Fix className use on custom components
- Make passwords deletable (with strict confirm)

### Other

- Document document document
- Write file sctructure section in README
- Fix documentation of props argument to follow correct format

## Things learned
How to make use of the Set-Cookie and Cookie headers for more secure JWT storage.

When Firefox receives a Set-Cookie header from an XMLHttpRequest, it DOES set the Cookie header for all subsequent "regular" browser requests

AES256 requires specific initialization vector (128 bit) and key (256 bit) lengths.

How to React

## Hosting

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

### start:dev:noauth

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