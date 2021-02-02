import './scss/style.scss';
import ReactDOM from 'react-dom';
import NewPasswordForm from './components/NewPasswordForm.jsx';
const $ = require('jquery');

const domContainer = document.querySelector('#react_root');

const onPassword = (password) => {
	// TODO do ajax post for password
	console.log(password);
	// AJAX password info
	const options = {
		url: 'api/passwords',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		data: JSON.stringify(password)
	};

	$.ajax(options).then(data => {
		console.log(data);
		document.location.href = '/';
	}).catch(err => {
		console.log(err);
		console.log('Password insertion failed');
	});

	console.log('Submitted!');
};

const page = <div className="mt-3">
	<NewPasswordForm onPassword={onPassword} />
</div>;

ReactDOM.render(page, domContainer);
