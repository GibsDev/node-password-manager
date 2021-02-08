import Password from './Password.jsx';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

/**
 * A list of passwords that can be filtered
 * @param {Object} props The props for this component
 * @param {Object} props.className The className appended to the root component
 * @param {Object} props.style The style for the root component
 * @param {Object} props.style The style for the root component
 * @param {Object} props.passwords All of the passwords in this list
 * @param {Object} props.query The filter for which passwords should be visible
 */
const PasswordList = ({ className, style, passwords, query }) => {

	const [allPasswords, setPasswords] = useState(passwords);
	const [filter, setFilter] = useState(query);

	useEffect(() => {
		setPasswords(passwords);
	}, [passwords]);

	const _onPasswordDeleted = name => {
		const newPasswords = [];
		allPasswords.forEach(pass => {
			if (pass.name != name) newPasswords.push(pass);
		});
		setPasswords(newPasswords);
	};

	const getPasswordComponents = () => {
		return allPasswords.filter(pass => {
			return pass.name.toLowerCase().includes(filter.toLowerCase())
				|| pass.info.toLowerCase().includes(filter.toLowerCase());
		}).map((password) => {
			return <Password
				className='mb-2'
				key={password.name}
				onDelete={_onPasswordDeleted}
				password={password} />;
		});
	};

	return (
		<div className={className} style={style}>
			<div className='input-group mb-3'>
				<div className='input-group-prepend'>
					<span className='input-group-text'>Filter</span>
				</div>
				<input onChange={e => { setFilter(e.target.value); }} type='text' className='form-control' id='filter' />
			</div>
			<div className='d-flex flex-column unselectable'>
				{getPasswordComponents()}
			</div>
		</div>
	);

};

PasswordList.defaultProps = {
	className: '',
	style: {},
	passwords: [],
	query: ''
};

PasswordList.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	passwords: PropTypes.arrayOf(PropTypes.object),
	query: PropTypes.string
};

export default PasswordList;