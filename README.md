## Things learned
How to make use of the Set-Cookie and Cookie headers for more secure JWT storage.

When Firefox receives a Set-Cookie header from an XMLHttpRequest, it DOES set the Cookie header for all subsequent "regular" browser requests

AES256 requires specific initialization vector (128 bit) and key (256 bit) lengths.

## React reference

[Add React in One Minute](https://reactjs.org/docs/add-react-to-a-website.html#add-react-in-one-minute)

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

## TODO

- Get webpack
- Configure babel through webpack.config.js
- make sure to use node development environment variable 
- change `dev` script to `start:dev`
- change `start:dev` script to use webpack instead of babel
- add development mode flag to `start:dev` script (`NODE_ENV=development node <app.js>`) and make sure to check for it in `webpack.config.js` using `process.env.NODE_ENV`
- remove `/public` and replace it with /build (change `server.js` to statically serve `/build` instead of `/public`)
- make sure webpack "builds" all file types we need (html, assets)
- Do react coding? Profit?


- Frontend
- Token expiration renewal on successful request?

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

public (static file serve)
bound: [app] /
provides:
    - /index.html
    - /login.html
    - /login.js
    - /script.js
    - /style.css

api (router)
bound: [app] /api/
provides:
    - TODO

auth (router)
bound: [api] /
provides:
    - /login
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