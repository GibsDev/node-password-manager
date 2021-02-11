import PropTypes from 'prop-types';
import TextField from './TextField.jsx';
import { useState } from 'react';
import { ajax } from 'jquery';

/**
 * Gets a username and password
 * @param props The properties object
 * @param {string} props.className className for the root element
 * @param {Object} props.style The style for the root element
 * @param {Object} props.onLogin Callback for when the user submits credentials
 */
const LoginForm = ({ className, style, onLogin }) => {

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [buttonText, setButtonText] = useState('Login');
	const [buttonStyle, setButtonStyle] = useState('btn-primary');
	const [loginLoading, setLoginLoading] = useState(false);

	const submit = e => {
		e.preventDefault();
		_onLogin({ username: username, password: password });
	};

	const _onLogin = login => {
		// AJAX username and password
		const options = {
			url: 'api/login',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(login)
		};
	
		ajax(options).then(res => {
			console.log(res);
			if (onLogin) onLogin();
		}).catch(err => {
			console.log('Login failed');
			console.log(err);
			setButtonText('Login failed');
			setButtonStyle('btn-danger');
			setTimeout(() => {
				setButtonText('Login');
				setButtonStyle('btn-primary');
			}, 1000);
		}).finally(() => {
			setLoginLoading(false);
		});

		setLoginLoading(true);

	};

	return (
		<form className={`card ${className}`.trim()} style={style} onSubmit={submit}>
			<div className='card-header'>
				<strong>Login required</strong>
			</div>
			<div className='card-body'>
				<div className='input-group'>
					<div className='input-group-prepend'>
						<label className='input-group-text' htmlFor='username' >
							Username
						</label>
					</div>
					<TextField
						className='form-control'
						inputId='username'
						name='username'
						rawInput
						value={username}
						onChange={setUsername} />
				</div>
				<div className='input-group mt-1'>
					<div className='input-group-prepend'>
						<label className='input-group-text' htmlFor='password' >
							Password
						</label>
					</div>
					<TextField
						className='form-control'
						inputId='password'
						name='password'
						isPassword
						rawInput
						value={password}
						onChange={setPassword} />
				</div>
				<button type='submit' className={`btn btn-block ${buttonStyle} mt-1`} disabled={loginLoading}>{buttonText}</button>
			</div>
		</form>
	);
};

LoginForm.defaultProps = {
	className: '',
	style: { width: '20rem' }
};

LoginForm.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	onLogin: PropTypes.func
};

export default LoginForm;
