import React from 'react';
const $ = require( 'jquery' );

class LoginForm extends React.Component {

    constructor() {
        super()
        this.username = '';
        this.password = '';
        this.tokenListeners = [];
    }

    userChanged = (event) => {
        this.username = event.target.value;
    }
    
    passChanged = (event) => {
        this.password = event.target.value;
    }

    render() {
        return (
            <form>
                <label htmlFor="username">Username:</label><br/>
                <input onChange={this.userChanged} type="text" id="username" name="username"/><br/>
                <label htmlFor="password">Password:</label><br/>
                <input onChange={this.passChanged} type="password" id="password" name="password"/><br/>
                <input type="button" value="Login" onClick={this.submit}/>
            </form>
        );
    }

    submit = () => {
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
                for (let tokenListener of this.tokenListeners) {
                    tokenListener(data.token);
                }
            }
        };
        
        $.ajax(options);

        console.log('Submitted!');
    }

    addTokenListener = (func) => {
        this.tokenListeners.push(func);
    }
}

export default LoginForm;