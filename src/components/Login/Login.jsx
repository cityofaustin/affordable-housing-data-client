// react
import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
// axios
import axios from 'axios';
// import API from '../Api';
// dev files
import { debugLog } from '../utilities';
// css
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'
// import Nav from 'react-bootstrap/Nav';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			redirectToReferrer: false,
		}

		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin(e) {
		e.preventDefault(); // prevent form submit

		var email = document.getElementById('email_login').value;
		var myEle = document.getElementById("g-recaptcha-response");
    if(myEle){
        var recaptcha= myEle.value;
    }
		//var recaptcha = document.getElementById('g-recaptcha-response').value;
		var pass = document.getElementById('email_pass').value;
		if ((myEle && recaptcha=="") || email =="" || pass=="") {
			var elem = document.getElementById('captcha_error_msg');
			elem.style.display = 'block';
		} else {
		var postData = {
			email: email,
			pass: pass,
			recaptcha: recaptcha
		};
		axios.post(
			'/login',
			postData
		).then((res) => {
			var elem = document.getElementById('login_failed_msg');
			if (!res.data.success) {
				elem.style.display = 'block';
			} else {
				elem.style.display = 'none';
				localStorage.setItem('isLoggedIn', 'true');
				localStorage.setItem('email', email);
				localStorage.setItem('is_admin', res.data.is_admin);
				this.setState(() => ({
					redirectToReferrer: true
				}));
			}
		}).catch((e) => {
			var elem = document.getElementById('login_error_msg');
			elem.style.display = 'block';
			if (!(e && e.response && e.response.data && e.response.data.serverSideError)) {
				debugLog(
				    {
				        log: {
				            message: e.toString(),
				            level: "info",
				            origin: "client"
				        },
				        logToServer: true
				    }
				);
			}
		});
	}}

	render() {
		const { from } = {from: {pathname: '/update_properties'}};
		const { redirectToReferrer } = this.state;

		if (redirectToReferrer === true) {
			return <Redirect to={from} />
		}

		return(
			<div className="container">
				<div id='login-container'>
					
						<div id='login-img-container'>
							<img src='/img/house.png' alt="house" />
						</div>
						<div id='login-title-container'>
							<span id='affordable-housing-data-hub-title'>Austin Affordable Housing Data Portal</span>
						</div>
						<br/>
						<div className='login-form-container'>
							<div>
								<form className='form-group' method="POST">
								<div id='captcha_error_msg'>Please fill all fields.</div>
								<div id='login_failed_msg'>Login failed. Username and password combination is incorrect.</div>
								<div id='login_error_msg'>Login failed. Please contact system adminstrator for details.</div>
									<span>Email</span>
									<br/>
									<input id='email_login' className='login_input form-control' autoComplete='on'></input>
									<br/>
									<span>Password</span>
									<br/>
									<input id='email_pass' className='login_input form-control' type='password' autoComplete='on'></input>
									<br/>
									<div class="g-recaptcha" data-sitekey="6Lekd9EUAAAAAHUUq4MWQ1amMYQuZCGnHyQeiPwe"></div>
									<button id='btn-login' className='btn btn-primary btn-login' onClick={this.handleLogin}>Login</button>
							</form>
						</div>
						</div>
				</div>
			</div>
		)
	}
}

export {Login};
