import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PasswordField from './PasswordField.jsx';
const $ = require('jquery');

const Password = (props) => {

	const [passwordObject, setPasswordObject] = useState(props.password);
	const [key, setKey] = useState('');
	const [showBody, setShowBody] = useState(false);
	const [showDecrypt, setShowDecrypt] = useState(false);
	const [encrypted, setEncrypted] = useState(true);
	const [loading, setLoading] = useState(false);
	const [decryptError, setDecryptError] = useState(false);

	const decryptField = useRef(null);

	const unlock = () => {
		setShowBody(true);
		setShowDecrypt(true);
	};

	useEffect(() => {
		if (showDecrypt) {
			decryptField.current.focus();
		}
	}, [showDecrypt]);

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
		setLoading(true);
		$.ajax(options).then(res => {
			setPasswordObject(res);
			setShowDecrypt(false);
			setEncrypted(false);
			setLoading(false);
		}).catch(err => {
			console.log(err);
			setDecryptError(true);
			setTimeout(() => {
				setDecryptError(false);
			}, 5000);
			setLoading(false);
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
					<PasswordField className="mb-2" label="Info" value={passwordObject.info} />
					<PasswordField className="mb-2" hidden label="Username" value={passwordObject.username} />
					<PasswordField className="mb-2" hidden label="Password" value={passwordObject.password} />
					<PasswordField className="mb-0" hidden label="Private Info" value={passwordObject.pinfo} />
				</>
			);
		} else {
			return (
				<PasswordField label="Info" value={passwordObject.info} />
			);
		}
	};

	const decryptForm = () => {
		let buttonStyle = 'btn-primary';
		let buttonText = 'Decrypt';
		if (loading) {
			buttonStyle = 'btn-warning';
			buttonText = 'Decrypting';
		}
		let alert = <ul className="list-group mt-2">
			<li className="list-group-item list-group-item-danger">Failed to decrypt password</li>
		</ul>;
		if (!decryptError) {
			alert = null;
		}
		if (showDecrypt) {
			return (
				<>
					<form onSubmit={decrypt} className="input-group input-group float-right mt-3">
						<input ref={decryptField} autoFocus={true} autoCapitalize="off" className="form-control secret" type="text" value={key} onChange={e => setKey(e.target.value)}></input>
						<div className="input-group-append">
							<button type="submit" className={`btn btn ${buttonStyle}`} disabled={loading}>{buttonText}</button>
						</div>
					</form>
					{alert}
				</>
			);
		}
	};

	const unlockButton = () => {
		const unlockOrCancel = (showDecrypt) ? 'Cancel' : 'Unlock';
		let text = 'Lock';
		let buttonStyle = 'btn-outline-danger';
		let clickHandler = lock;
		if (encrypted) {
			if (showDecrypt) {
				text = 'Cancel';
				buttonStyle = 'btn-outline-warning';
			} else {
				text = 'Unlock';
				clickHandler = unlock;
				buttonStyle = 'btn-success';
			}
		}
		return (
			<button type="button" className={`btn ${buttonStyle} ml-4`} onClick={clickHandler}>{text}</button>
		);
	};

	const cardBody = () => {
		if (!showBody) {
			return;
		}
		return (
			<div className="card-body d-flex flex-column">
				{credentials()}
				{decryptForm()}
			</div>
		);
	};

	return (
		<div className={props.className + ' card'}>
			<div className="card-header d-flex flex-row align-items-center justify-content-end">
				<strong className="mr-auto mb-0 selectable">{passwordObject.name}</strong>
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