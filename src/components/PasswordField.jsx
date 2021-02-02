import PropTypes from 'prop-types';
import { useState } from 'react';

const COPY_MESSAGE = 'Copied';
const COPY_FAIL_MESSAGE = 'Copy failed';
const HIDDEN_MESSAGE = '<hidden>';

const copyToClipboardLegacy = (str) => {
	return new Promise((resolve, reject) => {
		const el = document.createElement('textarea');
		el.value = str;
		document.body.appendChild(el);
		el.select();
		const success = document.execCommand('copy');
		document.body.removeChild(el);
		if (success) resolve(); else reject();
	});
};

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

	const onSuccess = () => {
		setValue(COPY_MESSAGE);
		setTimeout(() => {
			(isHidden) ? hide() : show();
		}, 1000);
	};

	const onFailure = () => {
		setValue(COPY_FAIL_MESSAGE);
		setTimeout(() => {
			(isHidden) ? hide() : show();
		}, 1000);
	};

	const copy = () => {
		if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(value).then(onSuccess).catch(onFailure);
		} else {
			copyToClipboardLegacy(value).then(onSuccess).catch(onFailure);
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