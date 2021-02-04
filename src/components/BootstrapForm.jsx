import { useState } from 'react';
import BootField from './BootstrapField.jsx';
import PropTypes from 'prop-types';
import { htmlId, nextId } from '../utils/id';

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
const Form = (props) => {

	// We need to store titleId within state so that it does not generate a new id each time it updates
	const [titleId, setTitleId] = useState((props.title) ? htmlId(props.title) : nextId());

	// Format { id: { label: "Field Label", ... }, ... }
	let preFields = Object.assign({}, props.fields);

	// Parse fields to { id: { label: "Field Label", value: '', labelId: "some_id", isPassword: false } }
	for (const id in preFields) {
		const orig = Object.assign({}, preFields[id]);
		if (!orig.label) throw new Error(`Missing 'label' property for field '${id}'`);
		if (!orig.value) orig.value = '';
		if (!orig.isPassword) orig.isPassword = false;
		if (!orig.isSecret) orig.isSecret = false;
		if (!orig.labelId) orig.labelId = `${titleId}_${id}`;
		preFields[id] = orig;
	}

	// Format { id: { label: "Field Label", value: '', labelId: "some_id" } }
	const [fields, setFields] = useState(preFields);

	const submit = e => {
		// Do not POST
		e.preventDefault();
		const values = Object.assign({}, fields);
		// Converts { id: { label: "Field Label", value: '', labelId: "some_id" } } to { id: "Field Label" }
		for (const property in fields) {
			values[property] = values[property].value;
		}
		if (props.onSubmit) props.onSubmit(values);
	};

	const _onChange = e => {
		// Figure out which fields id changed and update them
		let fieldsId = '';
		for (const id in fields) {
			if (e.target.id == fields[id].labelId) {
				fieldsId = id;
				break;
			}
		}
		const newFields = Object.assign({}, fields);
		newFields[fieldsId].value = e.target.value;
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
				<BootField
					className={marginTop}
					key={`${titleId}_${id}`}
					inputId={`${titleId}_${id}`}
					beforeLabel={fields[id].label}
					value={fields[id].value}
					isPassword={fields[id].isPassword}
					isSecret={fields[id].isSecret}
					onChange={_onChange} />
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

Form.defaultProps = {
	className: '',
	style: {},
	buttonStyle: 'btn-primary'
};

Form.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	fields: PropTypes.object.isRequired,
	title: PropTypes.string,
	onSubmit: PropTypes.func,
	submitText: PropTypes.string.isRequired,
	buttonStyle: PropTypes.string
};

export default Form;