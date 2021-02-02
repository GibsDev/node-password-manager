import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PasswordField from './PasswordField.jsx';
const $ = require('jquery');

const Password = (props) => {

	const [passwordObject, setPasswordObject] = useState(props.password);
	const [key, setKey] = useState('');
	const [showBody, setShowBody] = useState(false);
	const [showDecrypt, setShowDecrypt] = useState(false);
	const [encrypted, setEncrypted] = useState(true);

	const unlock = () => {
		setShowBody(true);
		setShowDecrypt(true);
	};

	const decrypt = (e) => {
		const k = key;
		setKey('');
		e.preventDefault();
		const options = {
			url: 'api/passwords/' + passwordObject.name,
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-API-Key", key);
			}
		};
		$.ajax(options).then(res => {
			console.log(res);
			setPasswordObject(res);
			setShowDecrypt(false);
			setEncrypted(false);
		}).catch(err => {
			console.log(err);
		});
	};

	const lock = () => {
		setShowBody(false);
		setShowDecrypt(false);
		setEncrypted(true);
		const pass = passwordObject;
		delete pass.username;
		delete pass.password;
		delete pass.pinfo;
		setPasswordObject(pass);
	};

	const credentials = () => {
		if (passwordObject.password) {
			return (
				<>
					<PasswordField className="mb-1" peekable={true} label="Username" value={passwordObject.username} />
					<PasswordField className="mb-1" peekable={true} label="Password" value={passwordObject.password} />
					<PasswordField className="mb-1" peekable={true} label="Info" value={passwordObject.info} />
					<PasswordField className="mb-0" peekable={true} label="Private Info" value={passwordObject.pinfo} />
				</>
			);
		} else {
			return (
				<PasswordField label="Info" hidden={false} value={passwordObject.info} />
			);
		}
	};

	const decryptForm = () => {
		if (showDecrypt) {
			return (
				<form onSubmit={decrypt} className="input-group input-group-sm float-right mt-3">
					<input autoCapitalize="off" className="form-control password" type="text" value={key} onChange={e => setKey(e.target.value)}></input>
					<div className="input-group-append">
						<button type="submit" className="btn btn-sm btn-primary">Decrypt</button>
					</div>
				</form>
			);
		}
	};

	const unlockButton = () => {
		const unlockOrCancel = (showDecrypt) ? 'Cancel' : 'Unlock';
		if (encrypted) {
			if (showDecrypt) {
				return (
					<button type="button" className="btn btn-sm btn-primary" onClick={lock}>Cancel</button>
				);
			}
			return (
				<button type="button" className="btn btn-sm btn-primary" onClick={unlock}>Unlock</button>
			);
		}
		return (
			<button type="button" className="btn btn-sm btn-primary" onClick={lock}>Lock</button>
		);
	};

	const cardBody = () => {
		if (!showBody) {
			return;
		}
		return (
			<div className="card-body">
				{credentials()}
				{decryptForm()}
			</div>
		);
	};

	return (
		<div className={props.className + ' card'}>
			<div className="card-header d-flex flex-row align-items-center justify-content-end">
				<p className="mr-auto mb-0">{passwordObject.name}</p>
				{unlockButton()}
			</div>
			{cardBody()}
		</div>
	);
};

Password.propTypes = {
	password: PropTypes.object,
	className: PropTypes.string
};

export default Password;