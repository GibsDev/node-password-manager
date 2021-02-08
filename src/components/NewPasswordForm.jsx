import PropTypes from 'prop-types';
import BootstrapForm from './BootstrapForm.jsx';

/**
 * 
 * @param {Object} props
 * @param {string} props.className className appended to the root element
 * @param {Object} props.style the style for the root element
 * @param {function} props.onPassword callback for when the password info is submitted
 */
const NewPasswordForm = ({ className, style, onPassword }) => {

	const fields = {
		name: {
			label: 'Name'
		},
		username: {
			label: 'Username',
			isSecret: true
		},
		password: {
			label: 'Password',
			isSecret: true
		},
		info: {
			label: 'Info'
		},
		pinfo: {
			label: 'Private info',
			isSecret: true
		},
		key: {
			label: 'Key',
			isSecret: true
		}
	};

	const submit = (passwordInfo) => {
		console.log(passwordInfo);
		// Forward password
		if (onPassword) onPassword(passwordInfo);
	};

	return (
		<div className={`card ${className}`.trim()} style={style} >
			<div className='card-header d-flex flex-row align-items-center justify-content-end'>
				<strong className='mr-auto mb-0 selectable'>Insert password</strong>
				<a className='btn btn-outline-warning ml-4' href='/'>Cancel</a>
			</div>
			<div className='card-body'>
				<BootstrapForm
					onSubmit={submit}
					submitText='Insert'
					buttonStyle='btn-primary btn-block'
					fields={fields}
				/>
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
	style: PropTypes.object,
	onPassword: PropTypes.func
};

export default NewPasswordForm;