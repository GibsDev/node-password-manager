import React from 'react';
import PropTypes from 'prop-types';
const $ = require('jquery');

const LoginForm = ({ onToken }) => {

	// TODO use state?
	let username = '';
	let password = '';

	const userChanged = (event) => {
		username = event.target.value;
	};

	const passChanged = (event) => {
		password = event.target.value;
	};

	const submit = (event) => {
		// DO NOT POST PARAMS TO URL
		event.preventDefault();
		// AJAX username and password
		const loginData = {
			username: username,
			password: password
		};
		const options = {
			url: 'api/login',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(loginData),
			success: (data) => {
				console.log(data);
				onToken(data.token);
			}
		};

		$.ajax(options);

		console.log('Submitted!');
	};

	return (
		<form onSubmit={submit}>
			<label htmlFor="username">Username:</label><br/>
			<input onChange={userChanged} type="text" id="username" name="username"/><br/>
			<label htmlFor="password">Password:</label><br/>
			<input onChange={passChanged} type="password" id="password" name="password"/><br/>
			<input type="submit" value="Login"/>
		</form>
	);
};

LoginForm.propTypes = {
	onToken: PropTypes.func
};

export default LoginForm;
