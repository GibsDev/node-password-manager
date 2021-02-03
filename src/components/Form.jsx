import React, { useState } from 'react';
import BootstrapField from './BootstrapField.jsx';
import PropTypes from 'prop-types';
import { htmlId, nextId } from '../utils/id';

/**
 * Creates a form that will callback the contents
 * @param {*} props.fields An object mapping { id: "Field Label" }
 * 	fields: PropTypes.object.isRequired,
 * @param {string} props.title The title of the form. If set the form will be wrapped in a card
 * @param {function} props.onSubmit callback for the content of the form
 * @param {string} props.className className appended root element
 * @param {string} props.submitText The text for the submit button
 * @param {string} props.buttonStyle The bootstrap button class for the submit button
 */
const Form = (props) => {

	const titleId = (props.title) ? htmlId(props.title) : nextId();

	// Format { id: "Field Label" }
	const preFields = Object.assign({}, props.fields);

	// Converts { id: "Field Label" } to { id: { label: "Field Label", value: '', labelId: "some_id" } }
	for (const id in preFields) {
		preFields[id] = {
			label: preFields[id],
			value: '',
			labelId: `${titleId}_${id}`
		};
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

	const onChange = e => {
		// Figure out which fields id changed
		let fieldsId = '';
		for (const id in fields) {
			if(e.target.id === fields[id].labelId) {
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
				<BootstrapField
					className={marginTop}
					key={`${titleId}_${id}`}
					inputId={`${titleId}_${id}`}
					beforeLabel={fields[id].label}
					value={fields[id].value}
					onChange={onChange}
				/>
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
			<form onSubmit={submit} className={`card ${props.className}`}>
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
			<form onSubmit={submit} className={`${props.className}`}>
				{getBody()}
			</form >
		);
	}

};

Form.defaultProps = {
	submitText: 'Submit',
	buttonStyle: 'btn-primary'
};

Form.propTypes = {
	fields: PropTypes.object.isRequired,
	title: PropTypes.string,
	onSubmit: PropTypes.func,
	className: PropTypes.string,
	submitText: PropTypes.string.isRequired,
	buttonStyle: PropTypes.string
};

export default Form;