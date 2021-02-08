import { useState } from 'react';
import PropTypes from 'prop-types';
import { htmlId, nextId } from '../utils/id';
import TextField from './TextField.jsx';

/**
 * @typedef {Object} FormFieldObject
 * @property {string} label The label for this field
 * @property {string} value The label for this field
 * @property {boolean} isPassword The label for this field
 * @property {boolean} isSecret The label for this field
 * @property {string} labelId The label for this field
 */

/**
 * Creates a form that will callback the contents
 * @param {Object} props The properties object
 * @param {string} props.className className for the root element
 * @param {Object} props.style The style for the root element
 * @param {string} props.title The title of the form. If set the form will be wrapped in a card
 * @param {function} props.onSubmit Callback for the content of the form
 * @param {string} props.submitText The text for the submit button
 * @param {string} props.buttonStyle The bootstrap button class for the submit button
 * @param {Object.<string, FormFieldObject>} props.fields An object that specifies details about each field in the form
 */
const BootstrapForm = ({ className, style, fields, title, onSubmit, submitText, buttonStyle }) => {

	// We need to store titleId within state so that it does not generate a new id each time it updates
	const [titleId, setTitleId] = useState((title) ? htmlId(title) : nextId());

	const parseState = (flds) => {
		// Format { id: { label: 'Field Label', ... }, ... }
		let resultFields = Object.assign({}, flds);
		// Parse fields to { id: { label: 'Field Label', value: '', labelId: 'some_id', isPassword: false } }
		for (const id in resultFields) {
			const orig = Object.assign({}, resultFields[id]);
			if (!orig.label) throw new Error(`Missing 'label' property for field '${id}'`);
			if (!orig.value) orig.value = '';
			if (!orig.isPassword) orig.isPassword = false;
			if (!orig.isSecret) orig.isSecret = false;
			if (!orig.labelId) orig.labelId = `${titleId}_${id}`;
			resultFields[id] = orig;
		}
		return resultFields;
	};

	// Format { id: { label: 'Field Label', value: '', labelId: 'some_id' } }
	const [currentFields, setFields] = useState(parseState(fields));

	// Creates an object mapping the field name to current value
	// { <field name>: '<current value>', ... }
	const parseValuesFromState = (flds) => {
		const values = Object.assign({}, flds);
		for (const property in values) {
			values[property] = values[property].value;
		}
		return values;
	};

	const submit = e => {
		// Do not POST
		e.preventDefault();
		if (onSubmit) onSubmit(parseValuesFromState(currentFields));
	};

	const _onChange = (value, id) => {
		const newFields = Object.assign({}, currentFields);
		newFields[id].value = value;
		setFields(newFields);
	};

	// Build a list of field components
	const items = Object.entries(currentFields).map(([id, field], index) => {
		const baseClassName = 'input-group';
		// Add margin top 1 to everything but the top
		const finalClassName = (index === 0) ? baseClassName : baseClassName + ' mt-1';
		return (
			<div key={`${titleId}_${id}_label`} className={finalClassName}>
				<div className='input-group-prepend'>
					<label className='input-group-text' htmlFor={`${titleId}_${id}`} >
						{field.label}
					</label>
				</div>
				<TextField
					className='form-control'
					inputId={`${titleId}_${id}`}
					isPassword={field.isPassword}
					isSecret={field.isSecret}
					value={field.value}
					onChange={value => _onChange(value, id)} />
			</div>
		);
	});

	const getBody = () => {
		return (
			<>
				{items}
				<button className={`mt-1 btn ${buttonStyle}`} type='submit'>
					{submitText}
				</button>
			</>
		);
	};

	if (title) {
		// Wrap in a bootstrap card
		return (
			<form style={style} onSubmit={submit} className={`card ${className}`}>
				<div className='card-header'>
					<strong>{title}</strong>
				</div>
				<div className='card-body'>
					{getBody()}
				</div>
			</form >
		);
	} else {
		// Naked
		return (
			<form style={style} onSubmit={submit} className={`${className}`}>
				{getBody()}
			</form >
		);
	}

};

BootstrapForm.defaultProps = {
	className: '',
	style: {},
	buttonStyle: 'btn-primary'
};

BootstrapForm.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	fields: PropTypes.object.isRequired,
	title: PropTypes.string,
	onSubmit: PropTypes.func,
	submitText: PropTypes.string.isRequired,
	buttonStyle: PropTypes.string
};

export default BootstrapForm;