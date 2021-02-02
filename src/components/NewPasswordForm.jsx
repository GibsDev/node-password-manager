import PropTypes from 'prop-types';
import { useForm } from '../utils/useForm';

const NewPasswordForm = ({ onPassword }) => {

	const [fields, formChanged] = useForm({
		name: '',
		username: '',
		password: '',
		info: '',
		pinfo: '',
		key: ''
	});

	const submit = (e) => {
		// Do not POST
		e.preventDefault();
		// Forward login info
		if (onPassword) onPassword(fields);
	};

	return (
		<form className="card" onSubmit={submit}>
			<div className="card-header d-flex flex-row align-items-center justify-content-end">
				<strong className="mr-auto mb-0 selectable">Insert password</strong>
				<a className="btn btn-outline-warning ml-4" href="/">Cancel</a>
			</div>
			<div className="card-body">
				<div className="input-group mb-1">
					<div className="input-group-prepend">
						<span className="input-group-text">Password name</span>
					</div>
					<input autoCapitalize="off" className="form-control" value={fields.name} onChange={formChanged} type="text" id="name" name="name" />
				</div>
				<div className="input-group mb-1">
					<div className="input-group-prepend">
						<span className="input-group-text">Username</span>
					</div>
					<input autoCapitalize="off" className="form-control" value={fields.username} onChange={formChanged} type="text" id="username" name="username" />
				</div>
				<div className="input-group mb-1">
					<div className="input-group-prepend">
						<span className="input-group-text">Password</span>
					</div>
					<input className="form-control" value={fields.password} onChange={formChanged} type="password" id="password" name="password" />
				</div>
				<div className="input-group mb-1">
					<div className="input-group-prepend">
						<span className="input-group-text">Info</span>
					</div>
					<input className="form-control" value={fields.info} onChange={formChanged} type="text" id="info" name="info" />
				</div>
				<div className="input-group mb-1">
					<div className="input-group-prepend">
						<span className="input-group-text">Private Info</span>
					</div>
					<input className="form-control" value={fields.pinfo} onChange={formChanged} type="password" id="pinfo" name="pinfo" />
				</div>
				<div className="input-group mt-3">
					<div className="input-group-prepend">
						<span className="input-group-text">Key</span>
					</div>
					<input className="form-control" value={fields.key} onChange={formChanged} type="password" id="key" name="key" />
					<div className="input-group-append">
						<button className="btn btn-primary btn-block" type="submit">Insert</button>
					</div>
				</div>
			</div>
		</form>
	);

};


NewPasswordForm.propTypes = {
	onPassword: PropTypes.func
};

export default NewPasswordForm;