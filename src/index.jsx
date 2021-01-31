import './scss/style.scss';
import ReactDOM from 'react-dom';
import PasswordList from './components/PasswordList.jsx';
const $ = require('jquery');

const domContainer = document.querySelector('#react_root');

// TODO list passwords

let password = <PasswordList query=""/>;
ReactDOM.render(password, domContainer);
