import PropTypes from 'prop-types';
import BootstrapForm from './BootstrapForm.jsx';

/**
 * Gets a username and password
 */
const LoginForm = ({ className, onLogin }) => {

	const submit = (credentials) => {
		console.log(credentials);
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
			style={{ width: '20rem' }}
			title="Login required"
			fields={fields}
			onSubmit={submit}
			submitText="Login"
			buttonStyle="btn-primary btn-block"
		/>
	);
};

LoginForm.propTypes = {
	className: PropTypes.string,
	onLogin: PropTypes.func
};

export default LoginForm;
