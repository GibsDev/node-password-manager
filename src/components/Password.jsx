import { useState } from 'react';
import PropTypes from 'prop-types';
const $ = require('jquery');

const Password = ({ password }) => {

	const [passwordObject, setPasswordObject] = useState(password);

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
	password: PropTypes.object
};

export default Password;