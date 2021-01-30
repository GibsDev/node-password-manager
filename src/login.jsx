import './scss/style.scss';
import ReactDOM from 'react-dom';
import LoginForm from './components/LoginForm.jsx';

const domContainer = document.querySelector('#react_root');

let loginForm = new LoginForm();

ReactDOM.render(loginForm.render(), domContainer);

loginForm.addTokenListener(token => {
    window.location.href = '/';
});