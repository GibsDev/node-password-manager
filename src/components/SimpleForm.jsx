import { useState } from 'react';
import BootstrapField from './BootstrapField.jsx';
import PropTypes from 'prop-types';

/**
 * Single input form with one button and no label
 * @param {object} props the properties object
 */
const Form = ({ className, style, value, label, id, onSubmit, isSecret }) => {

	const [currentValue, setValue] = useState('');

	const _onSubmit = e => {
		e.preventDefault();
		console.log(currentValue);
		if (onSubmit) onSubmit(currentValue);
	};

	return (
		<form onSubmit={_onSubmit}>
			<BootstrapField
				className={className}
				style={style} id={id}
				onChange={value => setValue(value)}
				afterLabel={label}
				afterStyle='btn-primary'
				isSecret={isSecret}
				value={value}
				afterProps={{type: 'submit'}} />
		</form>
	);
};

Form.defaultProps = {
	className: '',
	style: {},
	value: '',
	isSecret: false
};

Form.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onSubmit: PropTypes.func,
	value: PropTypes.string,
	isSecret: PropTypes.bool
};

export default Form;