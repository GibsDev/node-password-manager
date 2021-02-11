import './scss/style.scss';
import ReactDOM from 'react-dom';
import LoginForm from './components/LoginForm.jsx';
const $ = require('jquery');

const domContainer = document.querySelector('#react_root');

const onLogin = () => {
	const url = new URL(window.location.href);
	const returnurl = url.searchParams.get('returnurl');
	if (returnurl) {
		window.location.href = decodeURIComponent(returnurl);
	} else {
		window.location.href = '/';
	}
};

ReactDOM.render(<LoginForm className='mx-auto my-3' onLogin={onLogin} />, domContainer);
