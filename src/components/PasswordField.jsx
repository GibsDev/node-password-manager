import PropTypes from 'prop-types';

const PasswordField = ({className, label, value}) => {
	let rootClassname = "input-group input-group-sm mb-1";
	if (className) {
		rootClassname += className + ' ';
	}
	return (
		<div className={rootClassname}>
			<div className="input-group-prepend">
				<button title="Copy" className="btn btn-secondary">{label}</button>
			</div>
			<input type="text" className="form-control" readOnly value={value}></input>
			<div className="input-group-append">
				<button className="btn btn-outline-warning" type="button">Peek</button>
			</div>
		</div>
	);
};

PasswordField.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.string
};

export default PasswordField;