import Pressable from './Pressable.jsx';
import PropTypes from 'prop-types';
import { htmlId, nextId } from '../utils/id';
import TextField from './TextField.jsx';

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
 * @param {string} isPassword if the input is a password
 * @param {string} isSecret if the input should be hidden, but you do not want a browser to attempt to save it as a password
 * @param {string} hiddenHover the message while hidden and hovering
 * @param {string} beforeProps extra props to be added to before
 * @param {string} afterProps extra props to be added to after
 */
const BootstrapField = (props) => {

	const fieldId = (props.inputId) ? htmlId(props.inputId) : nextId();

	const _onChange = (value, e) => {
		if (props.onChange) props.onChange(value, e);
	};

	const before = () => {
		if (!props.beforeLabel) {
			return;
		}
		let label = <label {...props.beforeProps} className="input-group-text" htmlFor={fieldId}>{props.beforeLabel}</label>;
		if (props.beforeStyle.includes('btn')) {
			label = <button {...props.beforeProps} className={`btn ${props.beforeStyle}`}>{props.beforeLabel}</button>;
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
		return <TextField
			className='form-control'
			value={props.value}
			hideText={props.hideText}
			readOnly={props.readOnly}
			isPassword={props.isPassword}
			isSecret={props.isSecret}
			onChange={_onChange}
			id={props.inputId}
			hiddenHoverText={props.hiddenHoverText} />;
	};

	const after = () => {
		if (!props.afterLabel) {
			return;
		}
		let label = <label {...props.afterProps} className="input-group-text" htmlFor={fieldId}>{props.afterLabel}</label>;
		if (props.afterStyle.includes('btn')) {
			label = <button {...props.afterProps} className={`btn ${props.afterStyle}`}>{props.afterLabel}</button>;
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

BootstrapField.defaultProps = {
	value: '',
	readOnly: false,
	beforeStyle: 'input-group-text',
	afterStyle: 'btn-primary',
	isPassword: false,
	isSecret: false,
	beforeProps: {},
	afterProps: {}
};

BootstrapField.propTypes = {
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
	},
	isPassword: PropTypes.bool,
	isSecret: PropTypes.bool,
	hiddenHoverText: PropTypes.string,
	beforeProps: PropTypes.object,
	afterProps: PropTypes.object
};

export default BootstrapField;