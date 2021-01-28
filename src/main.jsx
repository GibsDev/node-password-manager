import './style.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from './LoginForm.jsx';

const domContainer = document.querySelector('#react_root');

ReactDOM.render(<LoginForm />, domContainer);

console.log('Hello from JSX');
