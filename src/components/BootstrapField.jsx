import { useState } from 'react';
import Pressable from './Pressable.jsx';
import PropTypes from 'prop-types';
import { htmlId, nextId } from '../utils/id';

/**
 * Creates a bootstrap input group with the option to add button/labels on either side of the input field.
 * @param {string} beforeLabel The label of the element before the input field (left)
 * @param {string} beforeStyle The style of the element before the input field (left). To make it a button, use a bootstrap button class for the style you want
 * @param {function} onBeforeDown The function to be called when the user presses on the before element
 * @param {function} onBeforeUp The function to be called when the user releases from the before element
 * @param {string} value The starting value to be shown in the input field
 * @param {string} onChange The starting value to be shown in the input field
 * @param {function} afterLabel The label of the element after the input field (right)
 * @param {string} afterStyle The style of the element after the input field (right). To make it a button, use a bootstrap button class for the style you want
 * @param {function} onAfterDown The function to be called when the user presses on the after element
 * @param {function} onAfterUp The function to be called when the user releases from the after element
 * @param {boolean} readOnly Sets the readonly attribute to the input
 * @param {string} hideText If specified, the text to use to hide the value of the input. This sets the input to readonly
 * @param {string} inputId The id for the input field. Warning: Will be converted using htmlId! If you need to keep track of it, make sure 'id' === htmlId('id'). See utils/id.js for htmlId
 * @param {string} className The className to be added to the root element
 */
const Input = (props) => {

	const [currentValue, setValue] = useState((props.hideText) ? props.hideText : props.value);
	const [readOnly, setReadOnly] = useState(props.readOnly || props.hideText && !props.readOnly);

	const fieldId = (props.inputId) ? htmlId(props.inputId) : nextId();

	const onFieldPress = () => {
		if (props.hideText && readOnly) {
			setValue(props.value);
		}
	};

	const onFieldRelease = () => {
		if (props.hideText && readOnly) {
			setValue(props.hideText);
		}
	};

	const onChange = e => {
		setValue(e.target.value);
		if (props.onChange) {
			props.onChange(e);
		}
	};

	const before = () => {
		if (!props.beforeLabel) {
			return;
		}
		let label = <label className="input-group-text" htmlFor={fieldId}>{props.beforeLabel}</label>;
		if (props.beforeStyle.includes('btn')) {
			label = <button className={`btn ${props.beforeStyle}`}>{props.beforeLabel}</button>;
		}
		return (
			<div className="input-group-prepend">
				<Pressable
					component={label}
					onPress={props.onBeforeDown}
					onRelease={props.onBeforeUp}
				/>
			</div>
		);
	};

	const field = () => {
		const input = <input
			id={fieldId}
			name={fieldId}
			readOnly={readOnly}
			className="form-control"
			onChange={onChange}
			value={currentValue}
		/>;
		return <Pressable
			onPress={onFieldPress}
			onRelease={onFieldRelease}
			component={input}
		/>;
	};

	const after = () => {
		if (!props.afterLabel) {
			return;
		}
		let label = <label className="input-group-text" htmlFor={fieldId}>{props.afterLabel}</label>;
		if (props.afterStyle.includes('btn')) {
			label = <button className={`btn ${props.afterStyle}`}>{props.afterLabel}</button>;
		}
		return (
			<div className="input-group-append">
				<Pressable
					component={label}
					onPress={props.onAfterDown}
					onRelease={props.onAfterUp}
				/>
			</div>
		);
	};

	return (
		<div className={`input-group ${props.className}`}>
			{before()}
			{field()}
			{after()}
		</div>
	);
};

Input.defaultProps = {
	value: '',
	readOnly: false,
	beforeStyle: 'input-group-text',
	afterStyle: 'btn-primary'
};

Input.propTypes = {
	beforeLabel: PropTypes.string,
	beforeStyle: PropTypes.string,
	onBeforeDown: PropTypes.func,
	onBeforeUp: PropTypes.func,
	value: PropTypes.string,
	afterLabel: PropTypes.string,
	afterStyle: PropTypes.string,
	onAfterDown: PropTypes.func,
	onAfterUp: PropTypes.func,
	onChange: PropTypes.func,
	className: PropTypes.string,
	readOnly: PropTypes.bool,
	hideText: PropTypes.string,
	inputId: (props, propName, componentName) => {
		if (props[propName]) {
			const id = props[propName];
			const html = htmlId(props[propName]);
			if (id !== html) {
				return new Error(`'inputId' changed from '${id}' to '${html}'! Please change the id if you need to track it.`);
			}
		}
	}
};

export default Input;