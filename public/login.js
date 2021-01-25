const submit = document.getElementById('submit');
const username = document.getElementById('username');
const password = document.getElementById('password');

submit.addEventListener('click', submitForm);

/**
 * Sends a POST request to /api/login with the given credentials in order to get an JWT token
 * The server will respond with a JWT token which could be used for other AJAX requests
 * The server will automatically respond with a Set-Cookie header so subsequent requests will have the JWT in the HTTP cookie header
 */
function submitForm() {
    console.log('submitted');
    let req = new XMLHttpRequest();
    req.addEventListener('load', () => {
        if (req.status == 200) {
            // Success
            console.log('Success');
        } else if (req.status == 401) {
            // Unauthorized (invalid login)
            console.log('Invalid login');
        }
        console.log('Server said: ', req.response);
    });
    req.addEventListener('error', e => { console.log(e) });
    req.open('POST', '/api/login');
    req.setRequestHeader('Content-Type', 'application/json');
    const login = {
        username: username.value,
        password: password.value
    };
    req.send(JSON.stringify(login));
}
