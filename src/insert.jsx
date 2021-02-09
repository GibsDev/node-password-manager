import './scss/style.scss';
import ReactDOM from 'react-dom';
import NewPasswordForm from './components/NewPasswordForm.jsx';
const $ = require('jquery');

const domContainer = document.querySelector('#react_root');

const page = <div className='mt-3'>
	<NewPasswordForm />
</div>;

ReactDOM.render(page, domContainer);
