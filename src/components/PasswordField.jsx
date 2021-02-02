import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const COPY_MESSAGE = 'Copied';
const COPY_FAIL_MESSAGE = 'Copied';
const HIDDEN_MESSAGE = '<hidden>';

const PasswordField = ({ className, label, value, hidden, peekable }) => {

	const [isHidden, setHidden] = useState(!(hidden === false));
	const [isPeekable, setPeekable] = useState(peekable === true);
	const [inputValue, setValue] = useState((isHidden) ? HIDDEN_MESSAGE : value);

	const hide = () => {
		setHidden(true);
		setValue(HIDDEN_MESSAGE);
	};

	const show = () => {
		setHidden(false);
		setValue(value);
	};

	const copy = () => {
		if (navigator.clipboard.writeText) {
			navigator.clipboard.writeText(value).then(() => {
				console.log('Copied ' + label);
				setValue(COPY_MESSAGE);
				setTimeout(() => {
					(isHidden) ? hide() : show();
				}, 1000);
			}).catch(err => {
				console.log(err);
				setValue(COPY_FAIL_MESSAGE);
				setTimeout(() => {
					(isHidden) ? hide() : show();
				}, 1000);
			});
		} else {
			setValue(COPY_FAIL_MESSAGE);
			setTimeout(() => {
				(isHidden) ? hide() : show();
			}, 1000);
		}
	};

	const peekButton = () => {
		if (isPeekable) {
			return (
				<div className="input-group-append">
					<button className="btn btn-light" type="button" onTouchStart={show} onTouchEnd={hide} onMouseDown={show} onMouseUp={hide} onMouseLeave={hide}>Peek</button>
				</div>
			);
		}
	};

	let rootClassname = "input-group input-group-sm";
	if (className) {
		rootClassname = className + ' ' + rootClassname;
	}
	return (
		<div className={rootClassname}>
			<div className="input-group-prepend">
				<button onTouchStart={copy} onClick={copy} title="Copy" className="btn btn-secondary">{label}</button>
			</div>
			<input type="text" className="form-control" readOnly value={inputValue}></input>
			{peekButton()}
		</div>
	);
};

PasswordField.propTypes = {
	className: PropTypes.string,
	label: PropTypes.string,
	value: PropTypes.string,
	hidden: PropTypes.bool,
	peekable: PropTypes.bool
};

export default PasswordField;