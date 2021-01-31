import './scss/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
//import PasswordList from './components/PasswordList.jsx';
import Password from './components/Password.jsx';

const domContainer = document.querySelector('#react_root');

// TODO list passwords
let password = <Password name='a name' username='a username' password='a password' info='some info' pinfo='some pinfo'/>;

ReactDOM.render(password, domContainer);

