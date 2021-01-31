import { useState } from 'react';
import PropTypes from 'prop-types';
const $ = require('jquery');

const Password = ({ name, username, password, info, pinfo }) => {

	const [passwordObject, setPasswordObject] = useState({
		name: name,
		username: username,
		password: password,
		info: info,
		pinfo: pinfo
	});

	return (
		<div className="card">
			<div className="card-header">{passwordObject.name}</div>
			<div className="card-body">
				<p className="card-text">
					Username: {passwordObject.username}<br/>
					Password: {passwordObject.password}<br/>
					Info: {passwordObject.info}<br/>
					Private Info: {passwordObject.pinfo}
				</p>
			</div>
		</div>
	);
};

Password.propTypes = {
	name: PropTypes.string,
	username: PropTypes.string,
	password: PropTypes.string,
	info: PropTypes.string,
	pinfo: PropTypes.string
};

export default Password;