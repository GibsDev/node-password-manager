import PropTypes from 'prop-types';
import BootstrapForm from './BootstrapForm.jsx';

/**
 * Gets a username and password
 * @param props The properties object
 * @param {string} props.className className for the root element
 * @param {Object} props.style The style for the root element
 * @param {Object} props.onLogin Callback for when the user submits credentials
 */
const LoginForm = ({ className, style, onLogin }) => {

	const submit = (credentials) => {
		// Forward login info
		if (onLogin) onLogin(credentials);
	};

	const fields = {
		username: {
			label: "Username"
		},
		password: {
			label: "Password",
			isPassword: true
		}
	};

	return (
		<BootstrapForm
			className={className}
			style={style}
			title="Login required"
			fields={fields}
			onSubmit={submit}
			submitText="Login"
			buttonStyle="btn-primary btn-block"
		/>
	);
};

BootstrapForm.defaultProps = {
	className: '',
	style: { width: '20rem' }
};

LoginForm.propTypes = {
	className: PropTypes.string,
	style: PropTypes.object,
	onLogin: PropTypes.func
};

export default LoginForm;
