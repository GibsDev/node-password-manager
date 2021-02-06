import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PasswordField from './PasswordField.jsx';
import SimpleForm from './SimpleForm.jsx';
import { htmlId } from '../utils/id';
const $ = require('jquery');

const Password = (props) => {

	const decryptInputElem = useRef(null);

	const [passwordObject, setPasswordObject] = useState(props.password);
	const [showBody, setShowBody] = useState(false);
	const [encrypted, setEncrypted] = useState(true);

	const decryptId = htmlId(passwordObject.name) + '_decrypt_field';
	const [showDecrypt, setShowDecrypt] = useState(false);
	const [decryptButtonStyle, setDecryptButtonStyle] = useState('btn-primary');
	const [decryptButtonText, setDecryptButtonText] = useState('Decrypt');

	const unlock = () => {
		setShowBody(true);
		setShowDecrypt(true);
	};

	useEffect(() => {
		if (showDecrypt) decryptInputElem.current.focus();
	}, [showDecrypt]);

	const decrypt = key => {
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
			setPasswordObject(res);
			setShowDecrypt(false);
			setEncrypted(false);
			setDecryptButtonStyle('btn-success');
			setTimeout(() => {
				setDecryptButtonStyle('btn-primary');
			}, 1000);
		}).catch(err => {
			console.log(err);
			document.getElementById(decryptId).value = '';
			setDecryptButtonStyle('btn-danger');
			setDecryptButtonText('Failed');
			setTimeout(() => {
				setDecryptButtonStyle('btn-primary');
				setDecryptButtonText('Decrypt');
			}, 1000);
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
		if (showDecrypt) {
			return <SimpleForm
				ref={decryptInputElem}
				className='mt-3'
				label={decryptButtonText}
				buttonStyle={decryptButtonStyle}
				isSecret
				onSubmit={decrypt}
				id={decryptId} />;
		}
	};

	const unlockButton = () => {
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
			<button
				type="button"
				className={`btn ${buttonStyle} ml-4`}
				onClick={clickHandler} >
				{text}
			</button>
		);
	};

	const cardBody = () => {
		if (showBody) {
			return (
				<div className="card-body d-flex flex-column">
					{credentials()}
					{decryptForm()}
				</div>
			);
		}
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