import { useEffect, useState } from 'react';
import Pressable from './Pressable.jsx';
import PropTypes from 'prop-types';
import { htmlId, nextId } from '../utils/id';

/**
 * A input component that can be hidden or obscured.
 * @param {object} props The props object for this component
 * @param {string} props.value The value of the field
 * @param {string} props.hideText The text to show when hidden. The field is hidden by default, and can be peeked by pressing on it. Sets props.readOnly=true.
 * @param {bool} props.readOnly Set readonly
 * @param {bool} props.isPassword Set type="password"
 * @param {bool} props.isSecret Obscure text without setting type="password" (so browsers no not ask to save)
 * @param {function} props.onChange Callback to the current value
 * @param {string} props.id The id to be set on the input field. Best to make sure id === htmlId(id)
 */
const Input = ({ className, value, hideText, readOnly, isPassword, isSecret, onChange, id }) => {
	
	// The actual current value of the field
	const [currentValue, setValue] = useState(value);
	const [shownValue, setShownValue] = useState((hideText) ? hideText : currentValue);
	const computedId = (id) ? htmlId(id) : nextId();
	const isReadOnly = hideText || readOnly;

	// Update shown value when inputs change
	useEffect(() => {
		setShownValue((hideText) ? hideText : currentValue);
	}, [hideText, currentValue]);

	const onFieldPress = () => {
		if (hideText) {
			showValue(currentValue);
		}
	};

	const onFieldRelease = () => {
		if (hideText) {
			showValue(hideText);
		}
	};

	const _onChange = e => {
		const inputVal = e.target.value;
		if (!hideText) {
			if (isSecret) {
				// Otherwise space is visible with the secret font
				showValue(inputVal.replaceAll(' ','\u00A4'));
				setValue(inputVal.replaceAll('\u00A4', ' '));
			} else {
				showValue(inputVal);
				setValue(inputVal);
			}
		} else {
			setValue(inputVal);
		}
	};

	const field = () => {
		const type = (isPassword) ? 'password' : 'text';
		let cn = className;
		if (isSecret) cn += ' secret';
		const input = <input
			type={type}
			id={computedId}
			name={computedId}
			readOnly={isReadOnly}
			className={cn}
			onChange={_onChange}
			value={shownValue}
		/>;
		return <Pressable
			onPress={onFieldPress}
			onRelease={onFieldRelease}
			component={input}/>;
	};

	return field();
};

Input.defaultProps = {
	value: '',
	readOnly: false,
	isPassword: false,
	isSecret: false,
	className: ''
};

Input.propTypes = {
	value: PropTypes.string,
	className: PropTypes.string,
	isPassword: PropTypes.bool,
	isSecret: PropTypes.bool,
	hideText: PropTypes.string,
	onChange: PropTypes.func,
	id: (props, propName, componentName) => {
		if (props[propName]) {
			const id = props[propName];
			const html = htmlId(props[propName]);
			if (id !== html) {
				return new Error(`'id' changed from '${id}' to '${html}'! Please change the id if you need to track it.`);
			}
		}
	}
};

export default Input;