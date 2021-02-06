import { useState, forwardRef } from 'react';
import TextField from './TextField.jsx';
import PropTypes from 'prop-types';

/**
 * Single input form with one button and no label
 * @param {object} props the properties object
 */
const SimpleForm = forwardRef(({ className, style, value, label, id, onSubmit, isSecret, buttonStyle }, ref) => {

	const [currentValue, setValue] = useState(value);

	const _onSubmit = e => {
		e.preventDefault();
		if (onSubmit) onSubmit(currentValue);
	};

	return (
		<form onSubmit={_onSubmit} style={style} className={'input-group ' + className}>
			<TextField
				ref={ref}
				className='form-control'
				isSecret={isSecret}
				id={id}
				onChange={v => setValue(v)} />
			<div className='input-group-append'>
				<button type='submit' className={'btn ' + buttonStyle}>{label}</button>
			</div>
		</form>
	);
});

SimpleForm.displayName = 'SimpleForm';

SimpleForm.defaultProps = {
	className: '',
	style: {},
	value: '',
	isSecret: false,
	buttonStyle: 'btn-primary'
};

SimpleForm.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onSubmit: PropTypes.func,
	value: PropTypes.string,
	isSecret: PropTypes.bool,
	buttonStyle: PropTypes.string
};

export default SimpleForm;