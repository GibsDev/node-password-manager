import PropTypes from 'prop-types';
import TextField from './TextField.jsx';
import { useEffect, useState } from 'react';
import { get, ajax } from 'jquery';
import Pressable from './Pressable.jsx';

/**
 * Form for inserting a new password
 * @param {Object} props
 * @param {string} props.className className appended to the root element
 * @param {Object} props.style the style for the root element
 */
const NewPasswordForm = ({ className, style }) => {

	const [insertConfirm, setInsertConfirm] = useState(false);
	const [insertDisabled, setInsertDisabled] = useState(true);
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [info, setInfo] = useState('');
	const [tags, setTags] = useState('');
	const [pinfo, setPinfo] = useState('');
	const [key, setKey] = useState('');

	const [generatePassword, setGeneratePassword] = useState(false);
	const [lowercase, setLowerCase] = useState(true);
	const [uppercase, setUpperCase] = useState(true);
	const [numbers, setNumbers] = useState(true);
	const [symbols, setSymbols] = useState(true);
	const [space, setSpace] = useState(false);
	const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
	const [forceSymbol, setForceSymbol] = useState(false);
	const [forceNumber, setForceNumber] = useState(false);
	const [forceUpperLower, setForceUpperLower] = useState(false);
	const [custom, setCustom] = useState('');
	const [length, setLength] = useState(16);

	const [usernameHidden, setUsernameHidden] = useState(true);
	const [passwordHidden, setPasswordHidden] = useState(true);
	const [pinfoHidden, setPinfoHidden] = useState(true);
	const [keyHidden, setKeyHidden] = useState(true);

	useEffect(() => {
		setInsertConfirm(false);
		if (name === '') {
			setInsertDisabled(true);
		} else {
			setInsertDisabled(false);
		}
	}, [name]);


	const getPasswordObj = () => {
		// String only info
		let finalInfo = info;
		if (tags.length > 0) {
			// With tags
			const finalTags = tags.split(',');
			finalTags.forEach((t, index) => {
				finalTags[index] = t.trim().toLowerCase();
			});
			finalInfo = {
				summary: info,
				tags: finalTags
			};
		}
		let pass = password;
		if (generatePassword) {
			pass = {
				length: length,
				lowercase: lowercase,
				uppercase: uppercase,
				numbers: numbers,
				symbols: symbols,
				space: space,
				ambiguous: !excludeAmbiguous,
				forceSymbol: forceSymbol,
				forceNumber: forceNumber,
				forceUpperLower: forceUpperLower,
				custom: custom
			};
		}
		return {
			name: name,
			username: username,
			password: pass,
			info: finalInfo,
			pinfo: pinfo,
			key: key
		};
	};

	const submitPasswordToAPI = () => {
		const password = getPasswordObj();
		// AJAX password info
		const options = {
			url: 'api/passwords',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			data: JSON.stringify(password)
		};

		ajax(options).then((data) => {
			console.log(data);
			document.location.href = '/';
		}).catch((jqXHR, textStatus, errorThrown) => {
			console.log('Password insertion failed');
		});

	};

	const submit = (e) => {
		e.preventDefault();
		// For some reason the overwrite button gets set to the submit button so we need this check
		const passwordObj = getPasswordObj();
		if (insertConfirm) {
			return;
		}
		get(`/api/passwords/${passwordObj.name}`).promise().then(() => {
			console.log('Password already exists, are you sure?');
			setInsertConfirm(true);
		}).catch((jqXHR, textStatus, errorThrown) => {
			submitPasswordToAPI();
		});
	};

	const getButtons = () => {
		if (!insertConfirm) {
			return <button
				className='mt-1 btn btn-primary btn-block'
				type='submit' disabled={insertDisabled}>Insert</button>;
		} else {
			return (
				<>
					<button
						className='mt-2 btn btn-primary btn-block'
						onClick={() => setInsertConfirm(false)}>Cancel</button>
					<button
						className='mt-1 btn btn-warning btn-block'
						onClick={submitPasswordToAPI}>Overwrite Existing Password</button>
				</>
			);
		}
	};

	const _generateToggled = e => {
		setPassword('');
		setGeneratePassword(e.target.checked);
	};

	const toggleButton = (label, id, state, stateFunc) => {
		return (
			<label key={id} className='my-1 mr-4' htmlFor={id}>
				<input type='checkbox' className='btn-check' id={id} autoComplete='off' checked={state} onChange={e => { stateFunc(e.target.checked); }}></input>
				&nbsp;{label}
			</label>
		);
	};

	const getPasswordField = () => {
		let options = null;
		if (generatePassword) {
			let pools = [];
			let forces = [];
			pools.push(toggleButton('Lower case', 'lowercase', lowercase, setLowerCase));
			pools.push(toggleButton('Upper case', 'uppercase', uppercase, setUpperCase));
			pools.push(toggleButton('Numbers', 'numbers', numbers, setNumbers));
			pools.push(toggleButton('Spaces', 'space', space, setSpace));
			pools.push(toggleButton('Symbols', 'symbols', symbols, setSymbols));
			pools.push(toggleButton('Exclude ambiguous symbols', 'ambiguous', excludeAmbiguous, setExcludeAmbiguous));
			forces.push(toggleButton('Needs symbol', 'forceSymbol', forceSymbol, setForceSymbol));
			forces.push(toggleButton('Needs number', 'forceNumber', forceNumber, setForceNumber));
			forces.push(toggleButton('Needs upper and lower case', 'forceUpperLower', forceUpperLower, setForceUpperLower));
			options = (
				<>
					<div>
						<div className='input-group my-1'>
							<div className='input-group-prepend'>
								<label className='input-group-text unselectable' htmlFor='custom' >
									Length
								</label>
							</div>
							<input
								type='number'
								className='form-control'
								id='length'
								name='length'
								value={length}
								onChange={e => { setLength(e.target.value); }}></input>
						</div>
						<strong>Character pool options:</strong><br></br>
						{pools}
						<div className='input-group my-1'>
							<div className='input-group-prepend'>
								<label className='input-group-text unselectable' htmlFor='custom' >
									Custom
								</label>
							</div>
							<TextField
								className='form-control'
								inputId='custom'
								name='custom'
								value={custom}
								placeholder='Additional pool of characters'
								onChange={setCustom} />
						</div>
						<strong>Enforce rules:</strong><br></br>
						{forces}
					</div>

				</>
			);
		}
		return (
			<div>
				<div className='input-group mt-1'>
					<div className='input-group-prepend'>
						<Pressable
							onPress={() => { setPasswordHidden(false); }}
							onRelease={() => { setPasswordHidden(true); }}>
							<label className='input-group-text unselectable' htmlFor='password' style={{ cursor: 'pointer' }} >
								Password&nbsp;<i className="bi-eye"></i>
							</label>
						</Pressable>
					</div>
					<TextField
						className='form-control'
						inputId='password'
						name='password'
						isSecret={passwordHidden}
						value={password}
						disabled={generatePassword}
						onChange={setPassword} />
					<div className='input-group-append'>
						<label className='btn btn-secondary mb-0' htmlFor='generate'>
							<input type='checkbox' className='btn-check' id='generate' autoComplete='off' checked={generatePassword} onChange={_generateToggled}></input>
							&nbsp;Generate
						</label>
					</div>
				</div>
				{options}
			</div>
		);
	};

	return (
		<div className={`card ${className}`.trim()} style={style} >
			<div className='card-header d-flex flex-row align-items-center justify-content-end'>
				<strong className='mr-auto mb-0 selectable'>Insert password</strong>
				<a className='btn btn-outline-warning ml-4' href='/'>Cancel</a>
			</div>
			<div className='card-body'>
				<form onSubmit={submit} >
					<div className='input-group mt-1'>
						<div className='input-group-prepend'>
							<label className='input-group-text unselectable' htmlFor='name' >
								Name
							</label>
						</div>
						<TextField
							className='form-control'
							inputId='name'
							name='name'
							value={name}
							placeholder='The name of this password'
							onChange={setName} />
					</div>
					<div className='input-group mt-1'>
						<div className='input-group-prepend'>
							<Pressable
								onPress={() => { setUsernameHidden(false); }}
								onRelease={() => { setUsernameHidden(true); }}>
								<label className='input-group-text unselectable' htmlFor='username' style={{ cursor: 'pointer' }} >
									Username&nbsp;<i className="bi-eye"></i>
								</label>
							</Pressable>
						</div>
						<TextField
							className='form-control'
							inputId='username'
							name='username'
							isSecret={usernameHidden}
							value={username}
							onChange={setUsername} />
					</div>
					{getPasswordField()}
					<div className='input-group mt-1'>
						<div className='input-group-prepend'>
							<label className='input-group-text unselectable' htmlFor='info' >
								Info
							</label>
						</div>
						<TextField
							className='form-control'
							inputId='info'
							name='info'
							value={info}
							placeholder='Visible info'
							onChange={setInfo} />
					</div>
					<div className='input-group mt-1'>
						<div className='input-group-prepend'>
							<label className='input-group-text unselectable' htmlFor='tags' >
								Tags
							</label>
						</div>
						<TextField
							className='form-control'
							inputId='tags'
							name='tags'
							value={tags}
							placeholder='Comma separated tags'
							onChange={setTags} />
					</div>
					<div className='input-group mt-1'>
						<div className='input-group-prepend'>
							<Pressable
								onPress={() => { setPinfoHidden(false); }}
								onRelease={() => { setPinfoHidden(true); }}>
								<label className='input-group-text unselectable' htmlFor='private-info' style={{ cursor: 'pointer' }} >
									Private info&nbsp;<i className="bi-eye"></i>
								</label>
							</Pressable>
						</div>
						<TextField
							className='form-control'
							inputId='private-info'
							name='private-info'
							isSecret={pinfoHidden}
							value={pinfo}
							placeholder='Info visible when unlocked'
							onChange={setPinfo} />
					</div>
					<div className='input-group mt-1'>
						<div className='input-group-prepend'>
							<Pressable
								onPress={() => { setKeyHidden(false); }}
								onRelease={() => { setKeyHidden(true); }}>
								<label className='input-group-text unselectable' htmlFor='key' style={{ cursor: 'pointer' }} >
									Key&nbsp;<i className="bi-eye"></i>
								</label>
							</Pressable>
						</div>
						<TextField
							className='form-control'
							inputId='key'
							name='key'
							isSecret={keyHidden}
							value={key}
							placeholder='Key for decrypting'
							onChange={setKey} />
					</div>
					{getButtons()}
				</form>
			</div>
		</div>
	);
};

NewPasswordForm.defaultProps = {
	className: '',
	style: {}
};

NewPasswordForm.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object
};

export default NewPasswordForm;