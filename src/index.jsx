import './scss/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import PasswordList from './components/PasswordList.jsx';

const domContainer = document.querySelector('#react_root');

// TODO list passwords
let passwords = new PasswordList();

ReactDOM.render(passwords.render(), domContainer);

