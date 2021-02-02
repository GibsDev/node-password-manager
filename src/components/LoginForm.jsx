import PropTypes from 'prop-types';
import { useForm } from '../utils/useForm';

/**
 * Gets a username and password
 */
const LoginForm = ({ className, onLogin }) => {

	const [fields, formChanged] = useForm({
		username: '',
		password: ''
	});

	const submit = (e) => {
		// Do not POST
		e.preventDefault();
		// Forward login info
		if (onLogin) onLogin(fields);
	};

	const getRootClassName = () => {
		const base = "card";
		if (className) {
			return `${base} ${className}`;
		}
		return base;
	};

	return (
		<form className={getRootClassName()} onSubmit={submit} style={{ width: '20rem' }}>
			<div className="card-header">
				<strong>Login required</strong>
			</div>
			<div className="card-body">
				<div className="input-group mb-1">
					<div className="input-group-prepend">
						<span className="input-group-text">Username</span>
					</div>
					<input autoCapitalize="off" className="form-control" value={fields.username} onChange={formChanged} type="text" id="username" name="username" />
				</div>
				<div className="input-group">
					<div className="input-group-prepend">
						<span className="input-group-text">Password</span>
					</div>
					<input className="form-control" value={fields.password} onChange={formChanged} type="password" id="password" name="password" />
				</div>
				<button className="btn btn-primary btn-block mt-2" type="submit">Login</button>
			</div>
		</form>
	);
};

LoginForm.propTypes = {
	className: PropTypes.string,
	onLogin: PropTypes.func
};

export default LoginForm;
