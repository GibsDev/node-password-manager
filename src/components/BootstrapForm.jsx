import { useState } from 'react';
import PropTypes from 'prop-types';
import { htmlId, nextId } from '../utils/id';
import TextField from './TextField.jsx';

/**
 * Creates a form that will callback the contents
 * @param {object} props the properties object
 * @param {string} props.className className appended root element
 * @param {obj} props.style The style to be applied to the root element
 * @param {object} props.fields An object mapping { id: "Field Label" }
 * @param {string} props.title The title of the form. If set the form will be wrapped in a card
 * @param {function} props.onSubmit callback for the content of the form
 * @param {string} props.submitText The text for the submit button
 * @param {string} props.buttonStyle The bootstrap button class for the submit button
 */
const BootstrapForm = (props) => {

	// We need to store titleId within state so that it does not generate a new id each time it updates
	const [titleId, setTitleId] = useState((props.title) ? htmlId(props.title) : nextId());

	const parseState = (flds) => {
		// Format { id: { label: "Field Label", ... }, ... }
		let resultFields = Object.assign({}, flds);
		// Parse fields to { id: { label: "Field Label", value: '', labelId: "some_id", isPassword: false } }
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

	const parseValuesFromState = (flds) => {
		const values = Object.assign({}, flds);
		// Converts { id: { label: "Field Label", value: '', labelId: "some_id" } } to { id: "Field Label" }
		for (const property in values) {
			values[property] = values[property].value;
		}
		return values;
	};

	// Format { id: { label: "Field Label", value: '', labelId: "some_id" } }
	const [fields, setFields] = useState(parseState(props.fields));

	const submit = e => {
		// Do not POST
		e.preventDefault();
		if (props.onSubmit) props.onSubmit(parseValuesFromState(fields));
	};

	const _onChange = (value, id) => {
		const newFields = Object.assign({}, fields);
		newFields[id].value = value;
		setFields(newFields);
	};

	const getFields = () => {
		const fieldElems = [];
		let first = true;
		for (const id in fields) {
			const marginTop = 'mt-1';
			if (first) {
				marginTop = '';
				first = false;
			}
			fieldElems.push(
				<div key={`${titleId}_${id}_label`} className='input-group'>
					<div className='input-group-prepend'>
						<label className='input-group-text' htmlFor={`${titleId}_${id}`} >
							{fields[id].label}
						</label>
					</div>
					<TextField
						className='form-control'
						inputId={`${titleId}_${id}`}
						isPassword={fields[id].isPassword}
						isSecret={fields[id].isSecret}
						value={fields[id].value}
						onChange={value => _onChange(value, id)} />
				</div>
			);
		}
		return fieldElems;
	};

	const getBody = () => {
		return (
			<>
				{getFields()}
				<button className={`mt-1 btn ${props.buttonStyle}`} type="submit">
					{props.submitText}
				</button>
			</>
		);
	};

	if (props.title) {
		// Card version
		return (
			<form style={props.style} onSubmit={submit} className={`card ${props.className}`}>
				<div className="card-header">
					<strong>{props.title}</strong>
				</div>
				<div className="card-body">
					{getBody()}
				</div>
			</form >
		);
	} else {
		// Naked
		return (
			<form style={props.style} onSubmit={submit} className={`${props.className}`}>
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