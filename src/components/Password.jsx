import React from 'react';
import PropTypes from 'prop-types';
const $ = require('jquery');

const Password = (props) => {
	
	return (
		<div className="card">
			<ul className="list-group list-group-flush">
				{Object.keys(props).map((propName) => (
					<li key={propName} className="list-group-item">{propName}: {props[propName]}</li>
				))}
			</ul>
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