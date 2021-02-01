import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
const $ = require('jquery');

const Password = ({ password }) => {

	const [passwordObject, setPasswordObject] = useState(password);
	const [key, setKey] = useState('');
	// TODO default false
	const [showDecrypt, setShowDecrypt] = useState(true);
	// TODO default false
	const [showCredentials, setShowCredentials] = useState(true);

	const toggleDecrypt = (e) => {
		setShowDecrypt(!showDecrypt);
	};

	const toggleCredentials = (e) => {
		setShowCredentials(!showCredentials);
	};

	const decrypt = (e) => {
		const k = key;
		setKey('');
		e.preventDefault();
		const options = {
			url: 'api/passwords/' + passwordObject.name,
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify({key: k})
		};
		$.ajax(options).then(res => {
			console.log(res);
			setPasswordObject(res);
		}).catch(err => {
			console.log(err);
		});
	};

	const credentials = () => {
		// TODO show public information?
		const credstyle = {
			color: 'rgba(0,0,0,0)'
		};
		if (showCredentials) delete credstyle.color;
		return (
			<pre  style={credstyle} className="card-text">
				Username: {passwordObject.username}<br />
				Password: {passwordObject.password}<br />
				Info: {passwordObject.info}<br />
				Private Info: {passwordObject.pinfo}
			</pre>
		);
	};

	const decryptForm = () => {
		if (showDecrypt) {
			return (
				<form onSubmit={decrypt} className="input-group float-right">
					<input className="form-control password" type="text" value={key} onChange={e => setKey(e.target.value)}></input>
					<div className="input-group-append">
						<button type="submit" className="btn btn-sm btn-primary">Decrypt</button>
					</div>
				</form>
			);
		}
	};

	return (
		<div className="card">
			<div className="card-header d-flex flex-row justify-content-end">
				<p className="mr-auto">{passwordObject.name}</p>
				<button type="button" className="btn btn-sm btn-outline-light ml-2" onClick={toggleCredentials}>Toggle</button>
				<button type="button" className="btn btn-sm btn-outline-light ml-2" onClick={toggleDecrypt}>Unlock</button>
			</div>
			<div className="card-body">
				{credentials()}
				{decryptForm()}
			</div>
		</div>
	);
};

Password.propTypes = {
	password: PropTypes.object
};

export default Password;