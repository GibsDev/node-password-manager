import React from 'react';
const $ = require( 'jquery' );

class LoginForm extends React.Component {

    constructor() {
        super()
        this.username = '';
        this.password = '';
        this.userChanged = this.userChanged.bind(this);
        this.passChanged = this.passChanged.bind(this);
        this.submit = this.submit.bind(this);
    }

    userChanged(event) {
        this.username = event.target.value;
    }
    
    passChanged(event) {
        this.password = event.target.value;
    }

    render() {
        return (
            <form>
                <label htmlFor="username">Username:</label><br/>
                <input onChange={this.userChanged} type="text" id="username" name="username"/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input onChange={this.passChanged} type="password" id="password" name="password"/><br/>
                <input type="button" value="Submit" onClick={this.submit}/>
            </form>
        );
    }

    submit() {
        console.log();
        let loginData = {
            username: this.username,
            password: this.password
        };
        let options = {
            url: 'api/login',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(loginData),
            success: (data) => {
                console.log(data);
            }
        };
        
        $.ajax(options);

        console.log('Submitted!');
    }
}

export default LoginForm;