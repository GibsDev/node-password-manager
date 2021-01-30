import './scss/style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Password from './components/Password.jsx';

const domContainer = document.querySelector('#react_root');

// TODO list passwords
let password = new Password();

ReactDOM.render(password.render(), domContainer);

