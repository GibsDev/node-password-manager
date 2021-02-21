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
		return {
			name: name,
			username: username,
			password: password,
			info: finalInfo,
			pinfo: pinfo,
			key: key
		};
	};

	const submitNewPassword = () => {
		const password = getPasswordObj();
		console.log(password);
		// AJAX password info
		const options = {
			url: 'api/passwords',
			type: 'POST',
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			data: JSON.stringify(password)
		};

		ajax(options).then(data => {
			console.log(data);
			document.location.href = '/';
		}).catch(err => {
			console.log(err);
			console.log('Password insertion failed');
		});

		console.log('Submitted!');
	};

	const submit = (e) => {
		e.preventDefault();
		const passwordObj = getPasswordObj();
		console.log(passwordObj);
		get({
			url: `/api/passwords/${passwordObj.name}`,
			success: () => {
				console.log('Password already exists, are you sure?');
				setInsertConfirm(true);
			},
			error: (res) => {
				if (res.status === 404) {
					console.log('Inserting new password');
					submitNewPassword();
				}
			}
		});
		return;
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
						onClick={submitNewPassword}>Overwrite Existing Password</button>
				</>
			);
		}
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
								<label className='input-group-text unselectable' htmlFor='username' style={{cursor: 'pointer'}} >
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
					<div className='input-group mt-1'>
						<div className='input-group-prepend'>
							<Pressable
								onPress={() => { setPasswordHidden(false); }}
								onRelease={() => { setPasswordHidden(true); }}>
								<label className='input-group-text unselectable' htmlFor='password' style={{cursor: 'pointer'}} >
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
							onChange={setPassword} />
					</div>
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
								<label className='input-group-text unselectable' htmlFor='private-info' style={{cursor: 'pointer'}} >
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
								<label className='input-group-text unselectable' htmlFor='key' style={{cursor: 'pointer'}} >
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