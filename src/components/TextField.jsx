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
 * @param {string} props.hiddenHover the hidden message while hovering
 */
const Input = ({ className, value, hideText, readOnly, isPassword, isSecret, onChange, id, hiddenHover }) => {

	// The actual current value of the field
	const [currentValue, setValue] = useState(value);
	const [currentHide, setHide] = useState(hideText);
	const [view, setView] = useState((currentHide) ? currentHide : currentValue);

	const [isPressed, setPressed] = useState(false);
	const [isHovered, setHovered] = useState(false);

	const computedId = (id) ? htmlId(id) : nextId();
	const isReadOnly = hideText || readOnly;

	// Update view
	useEffect(() => {
		setView(((!currentHide || isPressed)) ? currentValue : currentHide);
	}, [isPressed, currentValue, currentHide]);

	// Update hide message
	useEffect(() => {
		if (hideText) {
			setHide((hiddenHover && isHovered) ? hiddenHover : hideText);
		}
	}, [isHovered, hideText, hiddenHover]);

	const _onMouseOver = () => setHovered(true);
	const _onMouseOut = () => setHovered(false);
	const onFieldPress = () => setPressed(true);
	const onFieldRelease = () => setPressed(false);

	// When the input element onChange event occurs
	const _onChange = e => {
		const inputVal = e.target.value;
		if (hideText) {
			setValue(inputVal);
		} else if (isSecret) {
			// Otherwise space is visible with the secret font
			setView(inputVal.replaceAll(' ', '\u00A4'));
			setValue(inputVal.replaceAll('\u00A4', ' '));
		} else {
			setView(inputVal);
			setValue(inputVal);
		}
		if (onChange) onChange(e);
	};

	const field = () => {
		const type = (isPassword) ? 'password' : 'text';
		let cn = className;
		if (isSecret) cn += ' secret';
		const props = {
			type: type,
			id: computedId,
			name: computedId,
			readOnly: isReadOnly,
			className: cn,
			onChange: _onChange,
			value: view,
			onMouseOver: _onMouseOver,
			onMouseOut: _onMouseOut
		};
		if (isSecret || isPassword) {
			props.autoComplete = 'off';
			props.autoCorrect = 'off';
			props.autoCapitalize = 'off';
			props.spellCheck = 'off';
		}
		return <Pressable
			onPress={onFieldPress}
			onRelease={onFieldRelease}>
			<input {...props} />
		</Pressable>;
	};

	return field();
};

Input.defaultProps = {
	value: '',
	readOnly: false,
	isPassword: false,
	isSecret: false,
	className: '',
	peekTooltip: false
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
	},
	hiddenHover: PropTypes.string
};

export default Input;