import PropTypes from 'prop-types';
import TextField from './TextField.jsx';
import { useState, useEffect, useRef } from 'react';
import { ajax } from 'jquery';

const LOGIN_BUTTON_TEXT = 'Login';
const AUTH_CODE_BUTTON_TEXT = 'Submit code';

/**
 * Gets a username and password
 * @param props The properties object
 * @param {string} props.className className for the root element
 * @param {Object} props.style The style for the root element
 * @param {Object} props.onLogin Callback for when the user submits credentials
 */
const LoginForm = ({ className, style, onLogin }) => {

	// Reference to the code element so that we can programatically focus it
	const codeInputElem = useRef(null);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [authenticationCode, setAuthentication] = useState('');

	const [title, setTitle] = useState('Login required');
	const [buttonText, setButtonText] = useState(LOGIN_BUTTON_TEXT);
	const [buttonStyle, setButtonStyle] = useState('btn-primary');
	const [loginLoading, setLoginLoading] = useState(false);
	const [authenticationMode, setAuthenticationMode] = useState(false);

	useEffect(() => {
		if (authenticationMode) codeInputElem.current.focus();
	}, [authenticationMode]);

	const submit = e => {
		e.preventDefault();
		if (authenticationMode) {
			// Submit authentication
			_submitTwoFactor(authenticationCode);
		} else {
			// Regular login
			_submitLogin({ username: username, password: password });
		}
	};

	const _submitTwoFactor = code => {
		console.log('code:', code);
		const options = {
			url: 'api/auth',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify({ code: code })
		};
		ajax(options).then((res) => {
			if (onLogin) onLogin();
		}).catch(err => {
			console.log('Two factor authentication failed');
			console.error(err);
			setButtonText('Code failed');
			setButtonStyle('btn-danger');
			setTimeout(() => {
				setButtonText(AUTH_CODE_BUTTON_TEXT);
				setButtonStyle('btn-primary');
			}, 1000);
		});
	};

	const _submitLogin = login => {
		// AJAX username and password
		const options = {
			url: 'api/login',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(login)
		};

		ajax(options).then((res, textStatus, jqXHR) => {
			console.log(res);
			if (jqXHR.status === 201) {
				// Two factor authentication
				setAuthenticationMode(true);
				setButtonText(AUTH_CODE_BUTTON_TEXT);
				setTitle('Authentication code required');
			} else if (jqXHR.status === 200) {
				// Login
				if (onLogin) onLogin();
			}
		}).catch(err => {
			console.log('Login failed');
			console.error(err);
			setButtonText('Login failed');
			setButtonStyle('btn-danger');
			setTimeout(() => {
				setButtonText(LOGIN_BUTTON_TEXT);
				setButtonStyle('btn-primary');
			}, 1000);
		}).always(() => {
			setLoginLoading(false);
		});

		setLoginLoading(true);

	};

	const fields = [];

	if (!authenticationMode) {
		fields.push(
			<div key='username' className='input-group'>
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
		);
		fields.push(
			<div key='password' className='input-group mt-1'>
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
		);
	} else {
		fields.push(
			<div key='authentication' className='input-group mt-1'>
				<div className='input-group-prepend'>
					<label className='input-group-text' htmlFor='username' >
						Code
					</label>
				</div>
				<TextField
					ref={codeInputElem}
					className='form-control'
					inputId='authentication'
					name='authentication'
					value={authenticationCode}
					onChange={setAuthentication} />
			</div>
		);
	}

	return (
		<form className={`card ${className}`.trim()} style={style} onSubmit={submit}>
			<div className='card-header'>
				<strong>{title}</strong>
			</div>
			<div className='card-body'>
				{fields}
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
