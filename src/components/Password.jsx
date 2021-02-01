import { useState } from 'react';
import PropTypes from 'prop-types';
const $ = require('jquery');

const Password = ({ password }) => {

	const [passwordObject, setPasswordObject] = useState(password);
	const [key, setKey] = useState('');

	const decrypt = (e) => {
		const k = key;
		setKey('');
		e.preventDefault();
		console.log(k);
	};

	return (
		<div className="card">
			<div className="card-header">{passwordObject.name}</div>
			<div className="card-body">
				<pre className="card-text">
					Username: {passwordObject.username}<br/>
					Password: {passwordObject.password}<br/>
					Info: {passwordObject.info}<br/>
					Private Info: {passwordObject.pinfo}
				</pre>
				<form onSubmit={decrypt} className="input-group float-right">
					<input className="form-control password" type="text" value={key} onChange={e => setKey(e.target.value)}></input>
					<div className="input-group-append">
						<button type="submit" className="btn btn-primary">Decrypt</button>
					</div>
				</form>
			</div>
		</div>
	);
};

Password.propTypes = {
	password: PropTypes.object
};

export default Password;