## Things learned
How to make use of the Set-Cookie and Cookie headers for more secure JWT storage.

When Firefox receives a Set-Cookie header from an XMLHttpRequest, it DOES set the Cookie header for all subsequent "regular" browser requests

AES256 requires specific initialization vector (128 bit) and key (256 bit) lengths.

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

- React?
- Generate a private key each time the server starts or put it in a config? for JWT signing
- Token expiration renewal on successful request?
- Remove all sync functions? (atleast the ones that occur during HTTP requests)
- Implement password storage functionality

## JWT schema

- Client sends username and password to server.
- Server sends back JWT with the users username in the payload.
- Each subsequent request from the client includes the JWT token in the HTTP cookie until it expires
- On each request the server verifies the JWT token and gets the username of the person sending the request
- The server now has the ability to serve content specific to that username

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
User object
{
    username: <username>,
    password: <password>
}


Password object
{
    name: <password name>
    user: <login username>,
    pass: <login password>,
    info: <public info>,
    pinfo: <private information>
}

Encrypted password object
{
    name: <name of the password>,
    user: <encrypted string>,
    pass: <encrypted string>,
    info: <some unencrypted string about this password>,
    pinfo: <encrypted string about this password>,
    iv: <initialization vector string>
}

```

## Storage schema

File structure:
```
users.json
/passwords
    <user1>.json
    <user2>.json
```

`users.json`
```
{
    <username1>: {
        salt: <salt>,
        password: <hash>
    },
    <username2>: {
        salt: <salt>,
        password: <hash>
    },
    ...
}
```

`/passwords/<exampleuser>.json`
```
{
    <id1>: <encrypted password object>
}
```