import PropTypes from 'prop-types';
import { useState } from 'react';
import browser from '../utils/browser';
import BootstrapField from './BootstrapField.jsx';

const COPY_MESSAGE = 'Copied';
const COPY_FAIL_MESSAGE = 'Copy failed';
const HIDDEN_TEXT = '<hidden>';

/**
 * A read only field use for viewing password information that can copy its value to the clipboard
 * @param {Object} props
 * @param {string} props.className className appended to root element
 * @param {string} props.label the label prefix for the field
 * @param {string} props.value initial value for the field
 * @param {boolean} props.hidden if the field should be hidden
 */
const PasswordField = ({ className, label, value, hidden }) => {

	const [hiddenValue, setHiddenValue] = useState(HIDDEN_TEXT);
	const [currentLabel, setLabel] = useState(label);
	const deafultButtonStyle = 'btn-secondary';
	const [copyButtonStyle, setCopyButtonStyle] = useState(deafultButtonStyle);

	const copy = () => {
		browser.copy(value).then(() => {
			setHiddenValue(COPY_MESSAGE);
			setCopyButtonStyle('btn-success');
			setLabel('Copied');
		}).catch(err => {
			console.log(err);
			displayMessage(COPY_FAIL_MESSAGE, msgTime);
			setCopyButtonStyle('btn-danger');
			setLabel('Copy failed');
		}).finally(() => {
			// Reset
			const msgTime = 1000;
			setTimeout(() => {
				setCopyButtonStyle(deafultButtonStyle);
				setHiddenValue(HIDDEN_TEXT);
				setLabel(label);
			}, msgTime);
		});

	};

	const props = {
		className: className,
		readOnly: true,
		beforeStyle: copyButtonStyle,
		value: value,
		onBeforeDown: copy
	};
	if (hidden) {
		props.beforeLabel = label;
		props.hideText = hiddenValue;
		props.hiddenHoverText = '<peek>';
	} else {
		props.beforeLabel = currentLabel;
	}
	return <BootstrapField {...props} />;
};

PasswordField.defaultProps = {
	value: ''
};

PasswordField.propTypes = {
	label: PropTypes.string.isRequired,
	className: PropTypes.string,
	value: PropTypes.string,
	hidden: PropTypes.bool
};

export default PasswordField;