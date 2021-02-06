import { forwardRef, useCallback, useEffect, useState } from 'react';
import Pressable from './Pressable.jsx';
import PropTypes from 'prop-types';
import { htmlId, nextId } from '../utils/id';

/**
 * A input component that can be hidden or obscured.
 * @param {object} props The props object for this component
 * @param {string} props.className className appended to the root component
 * @param {string} props.value The value of the field
 * @param {bool} props.isPassword Set type="password"
 * @param {bool} props.isSecret Obscure text without setting type="password" (so browsers no not ask to save)
 * @param {bool} props.readOnly Set readonly
 * @param {string} props.hideText The text to show when hidden. The field is hidden by default, and can be peeked by pressing on it. Sets props.readOnly=true.
 * @param {string} props.hiddenHover the hidden message while hovering
 * @param {function} props.onChange Callback to the current value
 * @param {string} props.id The id to be set on the input field. Best to make sure id === htmlId(id)
 */
const TextField = forwardRef(({ className, value, hideText, readOnly, isPassword, isSecret, onChange, id, hiddenHoverText }, ref) => {

	// The actual current value of the field
	const [currentValue, setValue] = useState(value);
	const [prevValue, setPrevValue] = useState(value);
	const [view, setView] = useState((hideText) ? hideText : currentValue);

	const [isPressed, setPressed] = useState(false);
	const [isHovered, setHovered] = useState(false);

	const computedId = (id) ? htmlId(id) : nextId();
	const isReadOnly = hideText || readOnly;

	// Calculates what the view should be
	const calcView = useCallback(() => {
		// If we are obscuring the real value
		if (hideText) {
			if (isPressed) {
				return currentValue;
			}
			if (hiddenHoverText) {
				if (isHovered) {
					return hiddenHoverText;
				}
			}
			return hideText;
		}
		return currentValue;
	}, [currentValue, hiddenHoverText, hideText, isHovered, isPressed]);

	// Get new value from parent
	useEffect(() => {
		setValue(value);
	}, [value]);

	// Let parent know of changes
	useEffect(() => {
		// Only update if the value changed
		if (onChange && currentValue !== prevValue) {
			onChange(currentValue);
			setPrevValue(currentValue);
		}
	}, [currentValue, onChange, prevValue]);

	// Always show most current view
	useEffect(() => {
		setView(calcView());
	}, [currentValue, calcView]);

	const _onChange = e => {
		const value = e.target.value;
		if (value !== currentValue) {
			setValue(value);
		}
	};

	const _onMouseOver = () => setHovered(true);
	const _onMouseOut = () => setHovered(false);
	const onFieldPress = () => setPressed(true);
	const onFieldRelease = () => setPressed(false);

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
	return <Pressable onPress={onFieldPress} onRelease={onFieldRelease}>
		<input ref={ref} {...props} />
	</Pressable>;
});

TextField.displayName = 'TextField';

TextField.defaultProps = {
	className: '',
	value: '',
	isPassword: false,
	isSecret: false,
	readOnly: false,
	peekTooltip: false
};

TextField.propTypes = {
	className: PropTypes.string,
	value: PropTypes.string,
	isPassword: PropTypes.bool,
	isSecret: PropTypes.bool,
	readOnly: PropTypes.bool,
	hideText: PropTypes.string,
	hiddenHoverText: PropTypes.string,
	onChange: PropTypes.func,
	id: (props, propName, componentName) => {
		if (props[propName]) {
			const id = props[propName];
			const html = htmlId(props[propName]);
			if (id !== html) {
				return new Error(`'id' changed from '${id}' to '${html}' in '${componentName}'! Please change the id if you need to track it.`);
			}
		}
	}
};

export default TextField;