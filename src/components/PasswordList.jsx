import Password from './Password.jsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
const $ = require('jquery');

const PasswordList = ({ query }) => {

	const [passwords, setPasswords] = useState([]);

	// Anytime the query changes
	useEffect(() => {
		$.get('/api/passwords', data => {
			const paddids = data.passwords;
			const promises = [];
			const passes = [];
			paddids.forEach(id => {
				const get = $.get(`/api/passwords/${id}`, password => {
					passes.push(password);
				});
				promises.push(get);
			});
			Promise.all(promises).then(() => {
				setPasswords(passes);
			});
		});
	}, [query]);

	const passwordComps = passwords.map((password, index) => {
		return <Password key={index} password={password}/>;
	});

	return (
		<div>
			{passwordComps}
		</div>
	);

};

PasswordList.propTypes = {
	query: PropTypes.string
};

export default PasswordList;