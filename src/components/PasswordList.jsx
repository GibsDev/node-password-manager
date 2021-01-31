import Password from './Password.jsx';
const $ = require('jquery');

class PasswordList extends React.Component {

	constructor() {
		super();
		this.state = {
			error: null,
			isLoaded: true,
			passwords: [new Password(), new Password]
		};
	}

	render() {
		const { error, isLoaded, passwords } = this.state;
		if (error) {
			return <div>Error: error.message</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		}
		return (
			<div>
				<h2>Passwords...:</h2>
				<p>How do I make a list...?</p>
			</div>
		);
	}

}

export default PasswordList;