import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PasswordField from './PasswordField.jsx';
const $ = require('jquery');

const Password = (props) => {

	// TODO make each field peekable and copyable

	const [passwordObject, setPasswordObject] = useState(props.password);
	const [key, setKey] = useState('');
	const [showDecrypt, setShowDecrypt] = useState(false);
	const [encrypted, setEncrypted] = useState(true);

	const toggleDecrypt = (e) => {
		setShowDecrypt(!showDecrypt);
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
				xhr.setRequestHeader ("X-API-Key", key);
			}
		};
		$.ajax(options).then(res => {
			console.log(res);
			setPasswordObject(res);
			setShowDecrypt(false);
		}).catch(err => {
			console.log(err);
		});
	};

	const credentials = () => {
		if (passwordObject.password) {
			return (
				<>
					<PasswordField label="Username" value={passwordObject.username} />
					<PasswordField label="Password" value={passwordObject.password} />
					<PasswordField label="Info" value={passwordObject.info} />
					<PasswordField className="mb-0" label="Private Info" value={passwordObject.pinfo} />
				</>
			);
		} else {
			return (
				<p className="card-text">
					{passwordObject.info}
				</p>
			);
		}
		
	};

	const decryptForm = () => {
		if (showDecrypt) {
			return (
				<form onSubmit={decrypt} className="input-group input-group-sm float-right mt-2">
					<input className="form-control password" type="text" value={key} onChange={e => setKey(e.target.value)}></input>
					<div className="input-group-append">
						<button type="submit" className="btn btn-sm btn-primary">Decrypt</button>
					</div>
				</form>
			);
		}
	};

	return (
		<div className={props.className + ' card'}>
			<div className="card-header d-flex flex-row align-items-center justify-content-end">
				<p className="mr-auto">{passwordObject.name}</p>
				<button type="button" className="btn btn-sm btn-outline-light" onClick={toggleDecrypt}>Unlock</button>
			</div>
			<div className="card-body">
				{credentials()}
				{decryptForm()}
			</div>
		</div>
	);
};

Password.propTypes = {
	password: PropTypes.object,
	className: PropTypes.string
};

export default Password;