import './scss/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './components/LoginForm.jsx';

const domContainer = document.querySelector('#react_root');

const onToken = token => {
	const url = new URL(window.location.href);
	const returnurl = url.searchParams.get('returnurl');
	if (returnurl) {
		window.location.href = decodeURIComponent(returnurl);
	} else {
		window.location.href = '/';
	}
};

ReactDOM.render(<LoginForm onToken={onToken} />, domContainer);
