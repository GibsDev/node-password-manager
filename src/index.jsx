import './scss/style.scss';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import PasswordList from './components/PasswordList.jsx';
import $ from 'jquery';

const domContainer = document.querySelector('#react_root');

const Index = () => {

	const [passwords, setPasswords] = useState([]);

	useEffect(() => {
		$.get('/api/passwords').then(data => {
			const paddids = data.passwords;
			const promises = [];
			const passes = [];
			paddids.forEach(id => {
				const get = $.get(`/api/passwords/${id}`).then(password => {
					passes.push(password);
				}).catch(err => {
					console.log(err);
				});
				promises.push(get);
			});
			Promise.all(promises).then(() => {
				setPasswords(passes);
			});
		}).catch(err => {
			console.log(err);
		});
	}, []);

	return (
		<>
			<div className="d-flex flex-row align-items-center my-2">
				<h1 className="mr-auto">Passwords</h1>
				<a className="btn btn-outline-info ml-2" href="/insert">Insert</a>
				<a className="btn btn-outline-danger ml-2" href="/logout">Logout</a>
			</div>
			<PasswordList passwords={passwords} />
		</>
	);
};

ReactDOM.render(<Index />, domContainer);


