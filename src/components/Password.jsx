import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PasswordField from './PasswordField.jsx';
import SimpleForm from './SimpleForm.jsx';
import { htmlId } from '../utils/id';
const $ = require('jquery');

/**
 * A component for viewing and interacting with passwords
 * @param {Object} props The properties for this component
 * @param {string} props.className The className to append to the root component
 * @param {Object} props.style The style for this component
 * @param {Object} props.password The password object
 * @param {function} props.onDelete The callback for when this password is deleted
 * @param {function} props.onTagSelected The callback for when a tag is selected
 */
const Password = ({ className, style, password, onDelete, onTagSelected }) => {

	// Reference to the input element so that we can programatically focus it
	const decryptInputElem = useRef(null);

	// The password object for this component (can be encrypted or decrypted)
	const [passwordObject, setPasswordObject] = useState(password);
	// If we should show the body of the password bootstrap card
	const [showBody, setShowBody] = useState(false);
	// If the password is still encrypted
	const [encrypted, setEncrypted] = useState(true);
	// Intermediate state for confirming password deletion
	const [deletePrimed, setDeletePrimed] = useState(false);
	// The current value of the delete confirmation field
	const [deleteField, setDeleteField] = useState('');
	// If we should be showing the decrypt key entry field
	const [showDecrypt, setShowDecrypt] = useState(false);
	// The current look of the primary button in the header of the bootstrap card
	const [primaryButtonStyle, setDecryptButtonStyle] = useState('btn-primary');
	// The current text of the primary button in the header of the bootstrap card
	const [primaryButtonText, setDecryptButtonText] = useState('Decrypt');

	useEffect(() => {
		if (showDecrypt) decryptInputElem.current.focus();
	}, [showDecrypt]);

	const unlock = () => {
		setShowBody(true);
		setShowDecrypt(true);
	};

	// Reset everything
	const lock = () => {
		setShowBody(false);
		setShowDecrypt(false);
		setEncrypted(true);
		setDeletePrimed(false);
		setDeleteField('');
		const pass = passwordObject;
		delete pass.username;
		delete pass.password;
		delete pass.pinfo;
		setPasswordObject(pass);
	};

	const decrypt = key => {
		if (key === '') return;
		const options = {
			url: 'api/passwords/' + passwordObject.name,
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('X-API-Key', key);
			}
		};
		$.ajax(options).then(res => {
			setPasswordObject(res);
			setShowDecrypt(false);
			setEncrypted(false);
			setDecryptButtonStyle('btn-success');
			setTimeout(() => {
				setDecryptButtonStyle('btn-primary');
			}, 1000);
		}).catch(err => {
			console.log(err);
			decryptInputElem.current.value = '';
			setDecryptButtonStyle('btn-danger');
			setDecryptButtonText('Failed');
			setTimeout(() => {
				setDecryptButtonStyle('btn-primary');
				setDecryptButtonText('Decrypt');
			}, 1000);
		});
	};

	const decryptForm = () => {
		if (showDecrypt) {
			return <SimpleForm
				ref={decryptInputElem}
				className='mt-3'
				label={primaryButtonText}
				buttonStyle={primaryButtonStyle}
				isSecret
				onSubmit={decrypt}
				id={htmlId(passwordObject.name) + '_decrypt_field'} />;
		}
	};

	const deletePassword = () => {
		const options = {
			url: 'api/passwords/' + passwordObject.name,
			type: 'DELETE'
		};
		$.ajax(options).then(res => {
			// Success
			// Let the parent know it needs to be updated
			if (onDelete) onDelete(passwordObject.name);
		}).catch(err => {
			// Failure
			console.log('Password deletion failed');
			console.log(err);
		});
	};

	const deleteConfirmForm = e => {
		e.preventDefault();
		if (deleteField === passwordObject.name) deletePassword();
	};

	const cancelDeleteConfirm = () => {
		setDeletePrimed(false);
		setDeleteField('');
	};

	const primaryButton = () => {
		let text = 'Lock';
		let buttonStyle = 'btn-warning';
		let clickHandler = lock;
		if (encrypted) {
			if (showDecrypt) {
				text = 'Cancel';
				buttonStyle = 'btn-warning';
			} else {
				text = 'Unlock';
				clickHandler = unlock;
				buttonStyle = 'btn-success';
			}
		}
		if (deletePrimed) return;
		return (
			<button
				type='button'
				className={`btn ${buttonStyle} ml-2`}
				onClick={clickHandler} >
				{text}
			</button>
		);
	};

	const getPasswordFields = () => {
		let info = passwordObject.info;
		if (info instanceof Object && info.summary) {
			info = info.summary;
		}
		if (passwordObject.password) {
			return (
				<>
					<PasswordField className='mb-2' label='Info' value={info} />
					<PasswordField className='mb-2' hidden label='Username' value={passwordObject.username} />
					<PasswordField className='mb-2' hidden label='Password' value={passwordObject.password} />
					<PasswordField className='mb-0' hidden label='Private Info' value={passwordObject.pinfo} />
				</>
			);
		} else {
			return (
				<PasswordField label='Info' value={info} />
			);
		}
	};

	const cardBody = () => {
		if (showBody) {
			return (
				<div className='card-body d-flex flex-column'>
					{getPasswordFields()}
					{decryptForm()}
				</div>
			);
		}
	};

	const title = () => {
		const tagComps = [];
		// If we have tags
		if (passwordObject.info instanceof Object) {
			let baseClass = 'btn badge badge-dark ml-1 mt-1';
			const tags = passwordObject.info.tags.map((tag) => {
				return <button key={tag} className={baseClass} onClick={() => { onTagSelected(tag); }}>{tag}</button>;
			});
			tagComps.push(...tags);
		}
		return (
			<>
				<strong key='name' className={'mb-0 selectable mr-2'}>{passwordObject.name}</strong>
				<div className='d-flex flex-wrap mr-auto align-items-baseline'>
					{tagComps}
				</div>
			</>
		);
	};

	const header = () => {
		let first = title();
		let deletePrimerButton = <button
			className='btn btn-outline-danger ml-2'
			onClick={() => setDeletePrimed(true)}>Delete</button>;
		if (!showBody || deletePrimed) deletePrimerButton = null;
		if (deletePrimed) {
			first = (
				<form className='w-100' onSubmit={deleteConfirmForm}>
					<label className='selectable'>
						Type <strong className='selectable'>{passwordObject.name}</strong> to confirm
					</label>
					<div className='input-group'>
						<input
							type='text'
							className='form-control'
							value={deleteField}
							onChange={e => { setDeleteField(e.target.value); }} />
						<div className='input-group-append'>
							<button
								className='btn btn-danger'
								type='submit'>Delete</button>
							<button
								className='btn btn-warning'
								onClick={cancelDeleteConfirm}>Cancel</button>
						</div>
					</div>
				</form>
			);
		}
		return (
			<>
				{first}
				{deletePrimerButton}
				{primaryButton()}
			</>
		);
	};

	return (
		<div className={`card ${className}`.trim()} stlye={style}>
			<div className='card-header d-flex flex-row align-items-center justify-content-end'>
				{header()}
			</div>
			{cardBody()}
		</div>
	);
};


Password.defaultProps = {
	className: '',
	style: {}
};

Password.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	password: PropTypes.object.isRequired,
	onDelete: PropTypes.func,
	onTagSelected: PropTypes.func
};

export default Password;