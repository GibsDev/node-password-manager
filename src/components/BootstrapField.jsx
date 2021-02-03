import { useState } from 'react';
import Pressable from './Pressable.jsx';
import PropTypes from 'prop-types';

/**
 * Creates a bootstrap input group with the option to add button/labels on either side of the input field.
 * @param {string} beforeLabel The label of the element before the input field (left)
 * @param {string} beforeStyle The style of the element before the input field (left). To make it a button, use a bootstrap button class for the style you want
 * @param {function} onBeforeDown The function to be called when the user presses on the before element
 * @param {function} onBeforeUp The function to be called when the user releases from the before element
 * @param {string} value The starting value to be shown in the input field
 * @param {function} afterLabel The label of the element after the input field (right)
 * @param {string} afterStyle The style of the element after the input field (right). To make it a button, use a bootstrap button class for the style you want
 * @param {function} onAfterDown The function to be called when the user presses on the after element
 * @param {function} onAfterUp The function to be called when the user releases from the after element
 * @param {boolean} readOnly Sets the readonly attribute to the input
 * @param {string} hideText If specified, the text to use to hide the value of the input. Requires readOnly to be set
 */
const Input = (props) => {

	let initialValue = props.value || '';

	if (props.hideText) {
		if (!props.readOnly) {
			throw new Error(`'hideText' prop requires 'readOnly' prop`);
		}
		initialValue = props.hideText;
	}

	const [currentValue, setValue] = useState(initialValue);
	const beforeLabel = props.beforeLabel || '';
	const afterLabel = props.afterLabel || '';
	const beforeStyle = props.beforeStyle || 'input-group-text';
	const afterStyle = props.afterStyle || 'btn btn-primary';

	const before = () => {
		if (beforeLabel === '') {
			return;
		}
		let label = <span className="input-group-text">{beforeLabel}</span>;
		if (props.beforeStyle && props.beforeStyle.includes('btn')) {
			label = <button className={`btn ${beforeStyle}`}>{beforeLabel}</button>;
		}
		return (
			<div className="input-group-prepend">
				<Pressable component={label} onPress={props.onBeforeDown} onRelease={props.onBeforeUp} />
			</div>
		);
	};

	const onFieldPress = () => {
		if (props.hideText) {
			setValue(props.value);
		}
	};
	
	const onFieldRelease = () => {
		if (props.hideText) {
			setValue(props.hideText);
		}
	};

	const field = () => {
		const input = <input readOnly={props.readOnly} className="form-control" onChange={e => {setValue(e.target.value)}} value={currentValue} />;
		return <Pressable onPress={onFieldPress} onRelease={onFieldRelease} component={input} />;
	};

	const after = () => {
		if (afterLabel === '') {
			return;
		}
		let label = <span className="input-group-text">{afterLabel}</span>;
		if (props.afterStyle && props.afterStyle.includes('btn')) {
			label = <button className={`btn ${afterStyle}`}>{afterLabel}</button>;
		}
		return (
			<div className="input-group-append">
				<Pressable component={label} onPress={props.onAfterDown} onRelease={props.onAfterUp} />
			</div>
		);
	};

	return (
		<div className="input-group">
			{before()}
			{field()}
			{after()}
		</div>
	);
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
	hideText: PropTypes.string,
	readOnly: PropTypes.bool
};

export default Input;