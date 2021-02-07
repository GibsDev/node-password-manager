import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PasswordField from './PasswordField.jsx';
import SimpleForm from './SimpleForm.jsx';
import { htmlId } from '../utils/id';
const $ = require('jquery');

const Password = (props) => {

	const decryptInputElem = useRef(null);

	const [passwordObject, setPasswordObject] = useState(props.password);
	const [showBody, setShowBody] = useState(false);
	const [encrypted, setEncrypted] = useState(true);
	const [deletePrimed, setDeletePrimed] = useState(false);
	const [deleteField, setDeleteField] = useState('');

	const decryptId = htmlId(passwordObject.name) + '_decrypt_field';
	const [showDecrypt, setShowDecrypt] = useState(false);
	const [primaryButtonStyle, setDecryptButtonStyle] = useState('btn-primary');
	const [primaryButtonText, setDecryptButtonText] = useState('Decrypt');

	const unlock = () => {
		setShowBody(true);
		setShowDecrypt(true);
	};

	useEffect(() => {
		if (showDecrypt) decryptInputElem.current.focus();
	}, [showDecrypt]);

	const deletePassword = () => {
		const options = {
			url: 'api/passwords/' + passwordObject.name,
			type: 'DELETE'
		};
		$.ajax(options).then(res => {
			// Success
			// Let the parent know it needs to be updated
			if (props.onDelete) props.onDelete(passwordObject.name);
		}).catch(err => {
			// Failure
			console.log('Password deletion failed');
			console.log(err);
		});
	};

	const decrypt = key => {
		if (key === '') return;
		const options = {
			url: 'api/passwords/' + passwordObject.name,
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			beforeSend: function (xhr) {
				xhr.setRequestHeader("X-API-Key", key);
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
			document.getElementById(decryptId).value = '';
			setDecryptButtonStyle('btn-danger');
			setDecryptButtonText('Failed');
			setTimeout(() => {
				setDecryptButtonStyle('btn-primary');
				setDecryptButtonText('Decrypt');
			}, 1000);
		});
	};

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

	const credentials = () => {
		if (passwordObject.password) {
			return (
				<>
					<PasswordField className="mb-2" label="Info" value={passwordObject.info} />
					<PasswordField className="mb-2" hidden label="Username" value={passwordObject.username} />
					<PasswordField className="mb-2" hidden label="Password" value={passwordObject.password} />
					<PasswordField className="mb-0" hidden label="Private Info" value={passwordObject.pinfo} />
				</>
			);
		} else {
			return (
				<PasswordField label="Info" value={passwordObject.info} />
			);
		}
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
				id={decryptId} />;
		}
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
				type="button"
				className={`btn ${buttonStyle} ml-2`}
				onClick={clickHandler} >
				{text}
			</button>
		);
	};

	const cardBody = () => {
		if (showBody) {
			return (
				<div className="card-body d-flex flex-column">
					{credentials()}
					{decryptForm()}
				</div>
			);
		}
	};

	const header = () => {
		let first = <strong className="mr-auto mb-0 selectable">{passwordObject.name}</strong>;
		let deletePrimerButton = <button
			className='btn btn-outline-danger ml-2'
			onClick={() => setDeletePrimed(true)}>Delete</button>;
		if (encrypted) deletePrimerButton = null;
		if (deletePrimed) {
			if (!encrypted) {
				deletePrimerButton = null;
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
		<div className={props.className + ' card'}>
			<div className="card-header d-flex flex-row align-items-center justify-content-end">
				{header()}
			</div>
			{cardBody()}
		</div>
	);
};

Password.propTypes = {
	password: PropTypes.object,
	className: PropTypes.string,
	onDelete: PropTypes.func
};

export default Password;