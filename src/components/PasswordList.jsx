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

	const _onTagSelected = tag => {
		setFilter(tag);
	};

	const getPasswordComponents = () => {
		return allPasswords.filter(pass => {
			if (pass.info instanceof String) {
				if (pass.info.toLowerCase().includes(filter.toLowerCase())) return true;
			} else if (pass.info instanceof Object && pass.info.tags) {
				if (pass.info.tags.includes(filter.toLowerCase())) return true;
			}
			return pass.name.toLowerCase().includes(filter.toLowerCase());
		}).map((password) => {
			return <Password
				className='mb-2'
				key={password.name}
				onDelete={_onPasswordDeleted}
				password={password}
				onTagSelected={_onTagSelected} />;
		});
	};

	const clearButton = () => {
		if (filter.length > 0) {
			return (
				<div className='input-group-append'>
					<button className='btn btn-primary' onClick={() => {setFilter('');}}>Clear</button>
				</div>
			);
		}
	};

	const getTags = () => {
		// Use an object like a dictionary so we dont duplicate tags
		const tagDictionary = {};
		for (const password of allPasswords) {
			if (password.info.tags) {
				for (const tag of password.info.tags) {
					tagDictionary[tag] = true;
				}
			}
		}
		const tagNames = Object.keys(tagDictionary);
		const tagComps = tagNames.map(tag => {
			return <button key={tag} className='btn badge badge-pill badge-primary mr-2 mb-2' onClick={() => {setFilter(tag);}}>{tag}</button>;
		});
		if (tagComps.length == 0) return;
		return (
			<div className='d-flex flex-wrap pt-2'>
				{tagComps}
			</div>
		);
	};

	return (
		<div className={className} style={style}>
			<div className='input-group pb-2'>
				<div className='input-group-prepend'>
					<span className='input-group-text'>Filter</span>
				</div>
				<input value={filter} onChange={e => { setFilter(e.target.value); }} type='text' className='form-control' id='filter' />
				{clearButton()}
			</div>
			{getTags()}
			<div className='d-flex flex-column unselectable pt-2'>
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