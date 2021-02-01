import './scss/style.scss';
import ReactDOM from 'react-dom';
import PasswordList from './components/PasswordList.jsx';
const $ = require('jquery');

const domContainer = document.querySelector('#react_root');

// Get all passwords
$.get('/api/passwords', data => {
	const paddids = data.passwords;
	const promises = [];
	const passes = [];
	paddids.forEach(id => {
		const get = $.get(`/api/passwords/${id}`, password => {
			passes.push(password);
		});
		promises.push(get);
	});
	Promise.all(promises).then(() => {
		let password = <PasswordList query="" passwords={passes}/>;
		ReactDOM.render(password, domContainer);
	});
});

