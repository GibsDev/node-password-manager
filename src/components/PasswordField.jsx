import PropTypes from 'prop-types';
import { useState } from 'react';
import browser from '../utils/browser';
import Pressable from './Pressable.jsx';
import TextField from './TextField.jsx';

const COPY_MESSAGE = 'Copied';
const COPY_FAIL_MESSAGE = 'Copy failed';
const HIDDEN_TEXT = '<hidden>';
const HIDDEN_HOVER_TEXT = '<peek>';

/**
 * A read only field use for viewing password information that can copy its value to the clipboard
 * @param {Object} props
 * @param {string} props.className className appended to root element
 * @param {string} props.label the label prefix for the field
 * @param {string} props.value initial value for the field
 * @param {boolean} props.hidden if the field should be hidden
 */
const PasswordField = ({ className, style, label, value, hidden }) => {

	const deafultButtonStyle = 'btn-secondary';
	const [hiddenValue, setHiddenValue] = useState(HIDDEN_TEXT);
	const [currentLabel, setLabel] = useState(label);
	const [copyButtonStyle, setCopyButtonStyle] = useState(deafultButtonStyle);

	const copy = () => {
		const msgTime = 1000;
		browser.copy(value).then(() => {
			setHiddenValue(COPY_MESSAGE);
			setCopyButtonStyle('btn-success');
			setLabel('Copied');
		}).catch(err => {
			console.log(err);
			setHiddenValue(COPY_FAIL_MESSAGE);
			setCopyButtonStyle('btn-danger');
			setLabel('Copy failed');
		}).finally(() => {
			// Reset
			setTimeout(() => {
				setCopyButtonStyle(deafultButtonStyle);
				setHiddenValue(HIDDEN_TEXT);
				setLabel(label);
			}, msgTime);
		});

	};

	const fieldProps = {};
	if (hidden) {
		fieldProps.beforeLabel = label;
		fieldProps.hideText = hiddenValue;
		fieldProps.hiddenHoverText = HIDDEN_HOVER_TEXT;
	} else {
		fieldProps.beforeLabel = currentLabel;
	}
	return (
		<div className={className + ' input-group'} style={style}>
			<div className='input-group-prepend'>
				<Pressable onPress={copy}>
					<button className={'input-group-text btn ' + copyButtonStyle}>
						{(hidden) ? label : currentLabel}&nbsp;<i className="bi-clipboard" style={{marginTop:'-4px'}}></i>
					</button>
				</Pressable>
			</div>
			<TextField
				className={'form-control'}
				readOnly
				value={value}
				{...fieldProps} />
		</div>
	);
};

PasswordField.defaultProps = {
	className: '',
	style: {},
	value: ''
};

PasswordField.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	label: PropTypes.string.isRequired,
	value: PropTypes.string,
	hidden: PropTypes.bool
};

export default PasswordField;