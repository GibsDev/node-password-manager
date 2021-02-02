import Password from './Password.jsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const PasswordList = ({ passwords, query }) => {

	const [allPasswords, setPasswords] = useState(passwords || []);
	const [filter, setFilter] = useState(query || '');

	const getPasswordComponents = () => {
		return allPasswords.filter(pass => {
			return pass.name.toLowerCase().includes(filter.toLowerCase())
				|| pass.info.toLowerCase().includes(filter.toLowerCase());
		}).map((password) => {
			return <Password className="mb-2" key={password.name} password={password} />;
		});
	};

	useEffect(() => {
		setPasswords(passwords || []);
	}, [passwords]);

	return (
		<>
			<div className="input-group mb-3">
				<div className="input-group-prepend">
					<span className="input-group-text">Filter</span>
				</div>
				<input onChange={e => { setFilter(e.target.value); }} type="text" className="form-control" id="filter" />
			</div>
			<div className="d-flex flex-column unselectable">
				{getPasswordComponents()}
			</div>
		</>
	);

};

PasswordList.propTypes = {
	passwords: PropTypes.arrayOf(PropTypes.object),
	query: PropTypes.string
};

export default PasswordList;