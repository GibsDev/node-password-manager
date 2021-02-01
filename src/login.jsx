import './scss/style.scss';
import ReactDOM from 'react-dom';
import LoginForm from './components/LoginForm.jsx';
const $ = require('jquery');

const domContainer = document.querySelector('#react_root');

/**
 * Token received from AJAX
 * @param {string} token 
 */
const onToken = token => {
	const url = new URL(window.location.href);
	const returnurl = url.searchParams.get('returnurl');
	if (returnurl) {
		window.location.href = decodeURIComponent(returnurl);
	} else {
		window.location.href = '/';
	}
};

/**
 * Sends an AJAX request to login
 * @param {object} login { username: '...', password: '...' }
 */
const onLogin = login => {
	// AJAX username and password
	const options = {
		url: 'api/login',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(login)
	};

	$.ajax(options).then(data => {
		console.log(data);
		onToken(data.token);
	}).catch(err => {
		console.log(err);
		console.log('Login failed');
	});

	console.log('Submitted!');
};

ReactDOM.render(<LoginForm className="mx-auto my-3" onLogin={onLogin} />, domContainer);
