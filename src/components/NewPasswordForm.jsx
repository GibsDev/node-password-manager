import PropTypes from 'prop-types';
import BootstrapForm from './BootstrapForm.jsx';

const NewPasswordForm = ({ onPassword }) => {

	const fields = {
		name: {
			label: "Name"
		},
		username: {
			label: "Username",
			isSecret: true
		},
		password: {
			label: "Password",
			isSecret: true
		},
		info: {
			label: "Info"
		},
		pinfo: {
			label: "Private info",
			isSecret: true
		},
		key: {
			label: "Key",
			isSecret: true
		}
	};

	const submit = (passwordInfo) => {
		console.log(passwordInfo);
		// Forward password
		if (onPassword) onPassword(passwordInfo);
	};

	return (
		<div className="card">
			<div className="card-header d-flex flex-row align-items-center justify-content-end">
				<strong className="mr-auto mb-0 selectable">Insert password</strong>
				<a className="btn btn-outline-warning ml-4" href="/">Cancel</a>
			</div>
			<div className="card-body">
				<BootstrapForm
					onSubmit={submit}
					submitText="Insert"
					buttonStyle="btn-primary btn-block"
					fields={fields}
				/>
			</div>
		</div>
	);
};


NewPasswordForm.propTypes = {
	onPassword: PropTypes.func
};

export default NewPasswordForm;