import './scss/style.scss';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PasswordList from './components/PasswordList.jsx';
import $ from 'jquery';

const domContainer = document.querySelector('#react_root');

const Index = () => {

	const [passwords, setPasswords] = useState([]);

	useEffect(() => {
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
				setPasswords(passes);
			});
		});
	}, []);

	return (
		<>
			<h1>Passwords</h1>
			<PasswordList query="" passwords={passwords} />
		</>
	);
};

ReactDOM.render(<Index />, domContainer);


