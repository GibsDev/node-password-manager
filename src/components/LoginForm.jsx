import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from '../utils/useForm';
const $ = require('jquery');

const LoginForm = ({ onToken }) => {

	const [fields, formChanged] = useForm({
		username: '',
		password: ''
	});

	const submit = (event) => {
		// DO NOT POST PARAMS
		event.preventDefault();
		// AJAX username and password
		const options = {
			url: 'api/login',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(fields)
		};

		$.ajax(options).then(data => {
			console.log(data);
			onToken(data.token);
		});

		console.log('Submitted!');
	};

	return (
		<form onSubmit={submit}>
			<label htmlFor="username">Username:</label><br/>
			<input value={fields.username} onChange={formChanged} type="text" id="username" name="username"/><br/>
			<label htmlFor="password">Password:</label><br/>
			<input value={fields.password} onChange={formChanged} type="password" id="password" name="password"/><br/>
			<input type="submit" value="Login"/>
		</form>
	);
};

LoginForm.propTypes = {
	onToken: PropTypes.func
};

export default LoginForm;
