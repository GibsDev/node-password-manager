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
			let passes = [];
			paddids.forEach(id => {
				const get = $.get(`/api/passwords/${id}`).then(password => {
					passes.push(password);
				}).catch(err => {
					console.log(err);
				});
				promises.push(get);
			});
			Promise.all(promises).then(() => {
				passes = passes.sort((pass1, pass2) => pass1.name.localeCompare(pass2.name));
				setPasswords(passes);
			});
		}).catch(err => {
			console.log(err);
		});
	}, []);

	return (
		<>
			<div className='d-flex align-items-center flex-wrap my-2'>
				<h1  className='mr-4'>Passwords</h1>
				<div style={{ flexGrow: '1' }} className='d-flex flex-wrap align-items-baseline'>
					<a style={{flexGrow: '1'}} className='btn btn-outline-info' href='/insert'>Insert</a>
					<a style={{flexGrow: '1'}} className='btn btn-outline-danger ml-2' href='/logout'>Logout</a>
				</div>
			</div>
			<PasswordList passwords={passwords} />
		</>
	);
};

ReactDOM.render(<Index />, domContainer);


