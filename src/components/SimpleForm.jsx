import { useState } from 'react';
import BootstrapField from './BootstrapField.jsx';
import PropTypes from 'prop-types';

/**
 * Single input form with one button and no label
 * @param {object} props the properties object
 */
const Form = ({ className, style, value, label, id, onSubmit, isSecret, buttonStyle }) => {

	const [currentValue, setValue] = useState(value);

	const _onSubmit = e => {
		e.preventDefault();
		if (onSubmit) onSubmit(currentValue);
	};

	return (
		<form onSubmit={_onSubmit}>
			<BootstrapField
				className={className}
				style={style} id={id}
				onChange={value => setValue(value)}
				afterLabel={label}
				isSecret={isSecret}
				inputId={id}
				value={currentValue}
				afterStyle={buttonStyle}
				afterProps={{type: 'submit'}} />
		</form>
	);
};

Form.defaultProps = {
	className: '',
	style: {},
	value: '',
	isSecret: false,
	buttonStyle: 'btn-primary'
};

Form.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onSubmit: PropTypes.func,
	value: PropTypes.string,
	isSecret: PropTypes.bool,
	buttonStyle: PropTypes.string
};

export default Form;